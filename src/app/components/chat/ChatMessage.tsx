// ChatMessage.tsx
import React from "react";
import { MessageResponse } from "../../../hooks/apis/useChat";

interface ChatMessageProps {
  message: MessageResponse;
  onReply: (msg: MessageResponse) => void;
  user: any;
  isOwn: boolean;
}

// Simple avatar fallback
const Avatar = ({ name }: { name: string }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
    {name.charAt(0).toUpperCase()}
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onReply,
  // user,
  isOwn,
}) => {
  const senderName = message.senderName || "Unknown";

  return (
    <div
      className={`flex items-start gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
    >
      <Avatar name={senderName} />
      <div
        className={`flex max-w-[70%] flex-col ${isOwn ? "items-end" : "items-start"}`}
      >
        {!isOwn && (
          <span className="mb-1 text-xs font-semibold text-gray-600">
            {senderName}
          </span>
        )}
        {message.replyToId && (
          <div className="mb-1 max-w-full rounded border-l-4 border-green-400 bg-white px-2 py-1 pl-2 text-xs text-gray-600">
            <span className="font-medium">Reply to:</span>{" "}
            {message.replyToId.slice(0, 8)}...
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-2 shadow-sm ${
            isOwn
              ? "rounded-br-sm bg-green-500 text-white"
              : "rounded-bl-sm border border-green-200 bg-white"
          }`}
        >
          {message.content}
        </div>
        <span className="mt-1 text-xs text-gray-400">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <button
        onClick={() => onReply(message)}
        className="ml-1 self-center text-xs text-green-500 opacity-0 transition group-hover:opacity-100 hover:text-green-700"
      >
        Reply
      </button>
    </div>
  );
};

export default ChatMessage;
