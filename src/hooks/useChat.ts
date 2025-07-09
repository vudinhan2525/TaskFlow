// React hook for chat WebSocket logic: rooms, messages, typing, replies, history
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
}

export function useChat({
  userId,
  userName,
  wsUrl = "ws://localhost:5003",
}: UseChatOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, MessageResponse[]>>(
    {},
  );
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Connect WebSocket
  useEffect(() => {
    ws.current = new window.WebSocket(wsUrl);
    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);
    ws.current.onerror = () => setConnected(false);

    ws.current.onmessage = (event) => {
      console.log("WebSocket message:", event.data);
      try {
        const { event: evt, data } = JSON.parse(event.data);
        switch (evt) {
          case "connection_ack":
            // Optionally handle
            break;
          case "roomsList":
            console.log("Setting rooms to:", data);
            setRooms(data);
            break;
          case "messageReceived":
            setMessages((prev) => {
              const roomId = data.roomId;
              return {
                ...prev,
                [roomId]: [...(prev[roomId] || []), data],
              };
            });
            break;
          case "messageHistory":
            console.log(
              "Setting messages for room:",
              data.roomId,
              data.messages,
            );
            setMessages((prev) => ({
              ...prev,
              [data.roomId]: [
                ...(data.messages || []),
                ...(prev[data.roomId] || []),
              ],
            }));
            setLoadingHistory(false);
            break;
          case "userStartedTyping":
            setTypingUsers((prev) => {
              const { roomId, userId: typingId } = data;
              if (typingId === userId) return prev;
              return {
                ...prev,
                [roomId]: Array.from(
                  new Set([...(prev[roomId] || []), typingId]),
                ),
              };
            });
            break;
          case "userJoined":
            // Optionally handle
            break;
          case "error":
            // Optionally handle error
            break;
        }
      } catch {}
    };

    return () => {
      ws.current?.close();
    };
  }, [wsUrl, userId]);

  // Fetch rooms from backend via WebSocket
  const fetchRooms = useCallback(() => {
    console.log("fetchRooms called, ws.current:", ws.current);
    if (ws.current && ws.current.readyState === 1) {
      console.log("Sending getRooms event via WebSocket");
      ws.current.send(JSON.stringify({ event: "getRooms" }));
    } else {
      console.log("WebSocket not ready, cannot send getRooms");
    }
  }, []);

  // Send event
  const sendEvent = useCallback((event: string, data: any) => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({ event, data }));
    }
  }, []);

  // Join room
  const joinRoom = useCallback(
    (roomId: string) => {
      setCurrentRoom(roomId);
      sendEvent("joinRoom", { roomId });

      // Load history
      setLoadingHistory(true);
      sendEvent("getMessageHistory", { roomId, limit: 30 });
    },
    [sendEvent],
  );

  // Send message
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

  // Load more history (pagination)
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

  // Typing event
  // Remove startTyping if backend does not support typing events
  const startTyping = () => {};

  return {
    connected,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    messages,
    typingUsers,
    joinRoom,
    sendMessage,
    loadHistory,
    loadingHistory,
    startTyping,
    fetchRooms, // expose fetchRooms to trigger room fetching
  };
}
