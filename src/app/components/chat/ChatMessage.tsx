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
  const repliedMessage = useSelector((state: any) =>
    message.replyToId
      ? state.chat.messages[message.roomId]?.find(
          (m: MessageResponse) => m.id === message.replyToId,
        )
      : null,
  );

  return (
    <div className={`mb-2 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 shadow-sm transition-all duration-200 ${
          isOwn
            ? "ml-auto bg-blue-100 text-right hover:bg-blue-200"
            : "mr-auto bg-gray-100 text-left hover:bg-gray-200"
        }`}
      >
        <div
          className={`mb-1 flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
        >
          <span className="text-sm font-semibold">{message.senderName}</span>
          {message.replyToId && (
            <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
              Reply
            </span>
          )}
          <span className="min-w-[70px] text-right text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {message.replyToId && repliedMessage && (
          <div className="mb-2 border-l-4 border-gray-300 pl-2 text-xs text-gray-600">
            <div className="font-semibold">{repliedMessage.senderName}</div>
            <div className="truncate">{repliedMessage.content}</div>
          </div>
        )}
        <div className="text-sm">{message.content}</div>
        <button
          className="mt-1 text-xs text-blue-500 hover:underline"
          onClick={() => onReply(message)}
          aria-label={`Reply to message by ${message.senderName}`}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
