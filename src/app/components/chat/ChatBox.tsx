// Messenger-like chat box using useChat hook
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { MessageResponse, MessageType } from "../../../hooks/useChat";

interface ChatBoxProps {
  roomId: string;
  roomType: MessageType;
  roomName?: string;
  messages: MessageResponse[];
  sendMessage: (
    roomId: string,
    content: string,
    type: MessageType,
    replyToId?: string,
  ) => void;
  loadHistory: (roomId: string) => void;
  loadingHistory: boolean;
  typingUsers: Record<string, string[]>;
  startTyping: () => void;
  user: any;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  roomId,
  roomType,
  roomName,
  messages,
  sendMessage,
  loadHistory,
  loadingHistory,
  typingUsers,
  startTyping,
  user,
}) => {
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<MessageResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Infinite scroll for history
  const handleScroll = () => {
    if (
      chatListRef.current &&
      chatListRef.current.scrollTop === 0 &&
      !loadingHistory
    ) {
      loadHistory(roomId);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(roomId, input, roomType, replyTo?.id);
    setInput("");
    setReplyTo(null);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white shadow">
      <div className="border-b px-4 py-2 font-semibold">
        {roomName || "Chat"}
      </div>
      <div
        className="flex-1 overflow-y-auto p-4"
        ref={chatListRef}
        onScroll={handleScroll}
        style={{ minHeight: 0 }}
      >
        {loadingHistory && (
          <div className="mb-2 text-center text-xs text-gray-400">
            Loading history...
          </div>
        )}
        {messages.map((msg: MessageResponse) => (
          <ChatMessage key={msg.id} message={msg} onReply={setReplyTo} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col gap-1 border-t px-4 py-2">
        {replyTo && (
          <div className="mb-1 text-xs text-gray-600">
            Replying to:{" "}
            <span className="font-semibold">{replyTo.content}</span>
            <button
              className="ml-2 text-red-400 hover:underline"
              onClick={() => setReplyTo(null)}
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-2 py-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
              else startTyping();
            }}
            placeholder="Type a message..."
          />
          <button
            className="rounded bg-blue-500 px-4 py-1 text-white"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
        {typingUsers[roomId]?.length > 0 && (
          <div className="mt-1 text-xs text-gray-400">
            {typingUsers[roomId].join(", ")} typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
