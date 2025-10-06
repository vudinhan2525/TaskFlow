// ChatBox.tsx
import React, { useEffect, useRef, useState } from "react";
// import ChatMessage from "./ChatMessage";
import { MessageResponse, MessageType } from "../../../hooks/apis/useChat";

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
  // user,
}) => {
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<MessageResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Infinite scroll
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
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-green-100 bg-white shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-white">
        <div className="text-lg font-bold">{roomName || "Chat Room"}</div>
        <div className="text-sm opacity-90">
          {roomType === "GROUP" ? "Group" : "Direct"} • {messages.length}{" "}
          messages
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatListRef}
        onScroll={handleScroll}
        className="flex-1 space-y-3 overflow-y-auto bg-green-50 p-4"
        style={{ minHeight: 0 }}
      >
        {loadingHistory && (
          <div className="text-center text-sm text-green-600 italic">
            Loading older messages...
          </div>
        )}
        {/* {messages.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No messages yet</div>
        ) : (
          messages
            .slice()
            .reverse()
            .map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onReply={setReplyTo}
                user={user}
                isOwn={user?.id === msg.senderId}
              />
            ))
        )} */}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers[roomId]?.length > 0 && (
        <div className="border-t border-green-100 bg-green-50 px-4 py-1 text-xs text-green-700 italic">
          {typingUsers[roomId].join(", ")} is typing...
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-green-200 bg-white px-4 py-3">
        {replyTo && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-green-100 p-2 text-sm">
            <span className="font-semibold text-green-800">Replying to:</span>
            <span className="flex-1 truncate">{replyTo.content}</span>
            <button
              onClick={() => setReplyTo(null)}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
              else startTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-green-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-full bg-green-500 px-5 py-2 font-medium text-white transition hover:bg-green-600 disabled:bg-green-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
