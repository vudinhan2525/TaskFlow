import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

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
  wsUrl = "http://localhost:5003",
  authToken,
}: UseChatOptions) {
  const socket = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, MessageResponse[]>>(
    {},
  );
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    socket.current = io(wsUrl, {
      withCredentials: true,
      extraHeaders: authToken
        ? { Authorization: `Bearer ${authToken}` }
        : undefined,
      transports: ["websocket"], // Force WebSocket to avoid polling
    });

    socket.current.on("connect", () => {
      console.log("Socket.IO connected");
      setConnected(true);
      setConnectionError(null);
      retryCount.current = 0;
    });

    socket.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setConnected(false);
      setConnectionError("Socket.IO connection closed");
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message, error.stack);
      setConnected(false);
      setConnectionError(
        `Failed to connect to Socket.IO server: ${error.message}`,
      );
    });

    socket.current.on("connection_ack", (data) => {
      console.log("Connection acknowledged:", data);
    });

    socket.current.on("roomsList", (data) => {
      console.log("Received roomsList:", data);
      if (Array.isArray(data)) {
        setRooms(data);
        if (data.length === 0) {
          console.warn("No rooms returned from backend");
        }
      } else {
        console.error("Invalid roomsList data:", data);
        setConnectionError("Invalid rooms data received");
      }
      retryCount.current = 0;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    });

    socket.current.on("roomCreated", (data) => {
      console.log("Room created:", data);
      setRooms((prev) => [...prev, data]);
    });

    socket.current.on("messageReceived", (data) => {
      console.log("Message received:", data);
      setMessages((prev) => {
        const roomId = data.roomId;
        return {
          ...prev,
          [roomId]: [...(prev[roomId] || []), data],
        };
      });
    });

    socket.current.on("messageHistory", (data) => {
      console.log(
        "Received messageHistory for room:",
        data.roomId,
        data.messages,
      );
      setMessages((prev) => ({
        ...prev,
        [data.roomId]: [...(data.messages || []), ...(prev[data.roomId] || [])],
      }));
      setLoadingHistory(false);
    });

    socket.current.on("userStartedTyping", (data) => {
      console.log("User started typing:", data);
      setTypingUsers((prev) => {
        const { roomId, userId: typingId } = data;
        if (typingId === userId) return prev;
        return {
          ...prev,
          [roomId]: Array.from(new Set([...(prev[roomId] || []), typingId])),
        };
      });
    });

    socket.current.on("userJoined", (data) => {
      console.log("User joined:", data);
    });

    socket.current.on("error", (data) => {
      console.error("Backend error:", data.message);
      setConnectionError(data.message || "Backend error occurred");
    });

    return () => {
      socket.current?.disconnect();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [wsUrl, userId, authToken]);

  const fetchRooms = useCallback(() => {
    if (!socket.current || !socket.current.connected) {
      console.warn("Socket.IO not connected, cannot send getRooms");
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        const delay = Math.pow(2, retryCount.current) * 1000;
        console.log(
          `Retrying fetchRooms (${retryCount.current}/${maxRetries}) in ${delay}ms...`,
        );
        retryTimeoutRef.current = setTimeout(fetchRooms, delay);
      } else {
        setConnectionError("Failed to fetch rooms after multiple attempts");
      }
      return;
    }
    console.log("Sending getRooms event via Socket.IO");
    socket.current.emit("getRooms");
  }, []);

  const sendEvent = useCallback((event: string, data: any) => {
    if (socket.current && socket.current.connected) {
      console.log(`Sending ${event} event:`, data);
      socket.current.emit(event, data);
    } else {
      console.warn(`Cannot send ${event}: Socket.IO not connected`);
    }
  }, []);

  const joinRoom = useCallback(
    (roomId: string) => {
      setCurrentRoom(roomId);
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
      const type = "TEXT";
      console.log("Sending message:", { roomId, content, type, replyToId });
      sendEvent("sendMessage", { roomId, content, type, replyToId });
    },
    [sendEvent],
  );

  const createRoom = useCallback(
    (name: string, type: MessageType, members: string[]) => {
      console.log("Creating room:", { name, type, members });
      sendEvent("createRoom", { name, type, members });
    },
    [sendEvent],
  );

  const loadHistory = useCallback(
    (roomId: string) => {
      const msgs = messages[roomId] || [];
      if (msgs.length === 0) return;
      setLoadingHistory(true);
      sendEvent("getMessageHistory", {
        roomId,
        before: msgs[0].id,
        limit: 30,
      });
    },
    [messages, sendEvent],
  );

  const startTyping = useCallback(() => {
    // Implement if backend supports typing events
  }, []);

  useEffect(() => {
    if (connected) {
      console.log("Socket.IO connected, calling fetchRooms...");
      fetchRooms();
    }
  }, [connected, fetchRooms]);

  return {
    connected,
    connectionError,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    messages,
    typingUsers,
    joinRoom,
    sendMessage,
    createRoom,
    loadHistory,
    loadingHistory,
    startTyping,
    fetchRooms,
  };
}
