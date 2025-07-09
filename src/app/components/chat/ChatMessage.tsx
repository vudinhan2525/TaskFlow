// Renders a single chat message, including reply preview if present
import React from "react";
import { MessageResponse } from "../../../hooks/useChat";
import { useSelector } from "react-redux";

interface ChatMessageProps {
  message: MessageResponse;
  onReply: (msg: MessageResponse) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onReply }) => {
  const user = useSelector((state: any) => state.auth.user);
  const isOwn = user && message.senderId === user.id;

  return (
    <div className={`mb-2 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] ${
          isOwn
            ? "ml-auto rounded-tl-lg rounded-br-lg rounded-bl-lg bg-green-200 text-right"
            : "mr-auto rounded-tr-lg rounded-br-lg rounded-bl-lg bg-gray-100 text-left"
        } p-2`}
      >
        <div
          className={`mb-1 flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
        >
          <span className="text-sm font-bold">{message.senderName}</span>
          {message.replyToId && (
            <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              Reply
            </span>
          )}
          <span className="min-w-[70px] text-right text-xs text-gray-400">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>
        {message.replyToId && (
          <div className="mb-1 border-l-2 border-gray-200 pl-2 text-xs text-gray-500">
            {/* Optionally show replied message preview */}
            Replying to message {message.replyToId}
          </div>
        )}
        <div>{message.content}</div>
        <div>
          <button
            className="text-xs text-blue-500 hover:underline"
            onClick={() => onReply(message)}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
