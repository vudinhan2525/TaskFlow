import { useEffect, useRef, useState, useCallback } from "react";

export type MessageType = "DIRECT" | "GROUP";

export interface MessageResponse {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  createdAt: string;
  replyToId?: string;
}

export interface RoomInfo {
  id: string;
  name?: string;
  type: MessageType;
  members: string[];
}

interface UseChatOptions {
  userId: string;
  userName: string;
  wsUrl?: string;
  authToken?: string;
}

export function useChat({
  userId,
  userName,
  wsUrl = "/ws",
  authToken,
}: UseChatOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [messages, setMessages] = useState<Record<string, MessageResponse[]>>(
    {},
  );
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRoom = useRef<string | null>(null);

  const canConnect = Boolean(userId && authToken);
  // Reconnect logic
  const connect = useCallback(() => {
    if (!canConnect) {
      console.log("Cannot connect: userId or authToken missing");
      setConnectionError("Authenticating...");
      return;
    }
    if (ws.current?.readyState === WebSocket.OPEN) return;
    if (ws.current?.readyState === WebSocket.CONNECTING) return;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      setConnectionError(null);
      retryCount.current = 0;
      console.log("authToken:", authToken);
      // Send auth token as first message
      socket.send(
        JSON.stringify({
          event: "authenticate",
          data: { token: authToken },
        }),
      );
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      setConnected(false);
      setConnectionError("Disconnected");

      // Reconnect logic
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        const delay = Math.pow(2, retryCount.current) * 1000;
        console.log(`Reconnecting in ${delay}ms...`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      } else {
        setConnectionError("Failed to reconnect after multiple attempts");
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setConnectionError("Connection error");
    };

    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.error("Failed to parse message:", event.data);
        return;
      }

      console.log("Received:", data);

      switch (data.event) {
        case "connection_ack":
          console.log("Authenticated!");
          fetchRooms(); // now fetch rooms
          break;

        case "roomsList":
          if (Array.isArray(data.data?.rooms)) {
            setRooms(data.data.rooms);
          } else {
            console.error("Invalid roomsList format", data);
          }
          // setLoadingRooms(false);
          break;

        case "roomCreated":
          setRooms((prev) => [...prev, data.data]);
          break;

        case "messageReceived":
          setMessages((prev) => {
            const roomId = data.data.roomId;
            return {
              ...prev,
              [roomId]: [...(prev[roomId] || []), data.data],
            };
          });
          break;

        case "messageHistory": {
          const { roomId, messages: newMessages } = data.data || {}; // ✅ Fix: data.data

          if (!roomId || !Array.isArray(newMessages)) {
            console.warn("Invalid messageHistory data", data);
            setLoadingHistory(false);
            return;
          }

          setMessages((prev) => {
            const existingMessages = prev[roomId] || [];
            const existingIds = new Set(existingMessages.map((m) => m.id));

            const uniqueNewMessages = newMessages.filter(
              (msg) => !existingIds.has(msg.id),
            );

            return {
              ...prev,
              [roomId]: [...uniqueNewMessages, ...existingMessages],
            };
          });

          setLoadingHistory(false);
          break;
        }

        case "userStartedTyping":
          setTypingUsers((prev) => {
            const { roomId, userId: typingId } = data.data;
            if (typingId === userId) return prev;
            return {
              ...prev,
              [roomId]: Array.from(
                new Set([...(prev[roomId] || []), typingId]),
              ),
            };
          });
          break;

        case "error":
          console.error("WebSocket error:", data.data);
          // setLoadingRooms(false);
          setConnectionError(data.data.message);
          break;

        default:
          console.log("Unknown event:", data);
      }
    };

    ws.current = socket;
  }, [wsUrl, authToken]);

  const fetchRooms = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("📡 Sending: getRooms");
      ws.current.send(JSON.stringify({ event: "getRooms" }));
    } else {
      console.warn("WebSocket not open");
    }
  }, [ws]); // ✅ Now updates when ws changes

  const sendEvent = useCallback((event: string, data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ event, data }));
    } else {
      console.warn(`Cannot send ${event}: WebSocket not open`);
    }
  }, []);

  const joinRoom = useCallback(
    (roomId: string) => {
      currentRoom.current = roomId;
      sendEvent("joinRoom", { roomId });
      setLoadingHistory(true);
      sendEvent("getMessageHistory", { roomId, limit: 30 });
    },
    [sendEvent],
  );

  const sendMessage = useCallback(
    (
      roomId: string,
      content: string,
      _type: MessageType,
      replyToId?: string,
    ) => {
      sendEvent("sendMessage", { roomId, content, type: "TEXT", replyToId });
    },
    [sendEvent],
  );

  const createRoom = useCallback(
    (name: string, type: MessageType, members: string[]) => {
      sendEvent("createRoom", { name, type, members });
    },
    [sendEvent],
  );

  const loadHistory = useCallback(
    (roomId: string) => {
      const roomMessages = messages[roomId] || [];
      if (roomMessages.length === 0) return;

      setLoadingHistory(true);

      // ✅ Use the createdAt of the oldest message
      const oldestMessage = roomMessages[0]; // assuming sorted newest first
      sendEvent("getMessageHistory", {
        roomId,
        before: oldestMessage.createdAt, // ✅ ISO string
        limit: 30,
      });
    },
    [messages, sendEvent],
  );

  const startTyping = useCallback(() => {
    if (currentRoom.current) {
      sendEvent("startTyping", { roomId: currentRoom.current });
    }
  }, [sendEvent]);

  useEffect(() => {
    if (canConnect) {
      connect();
    }
  }, [canConnect, connect]);
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      ws.current?.close();
    };
  }, []);

  return {
    connected,
    connectionError,
    rooms,
    messages,
    typingUsers,
    joinRoom,
    sendMessage,
    createRoom,
    loadHistory,
    loadingHistory,
    startTyping,
    fetchRooms,
    setCurrentRoom: (id: string) => {
      currentRoom.current = id;
    },
  };
}
