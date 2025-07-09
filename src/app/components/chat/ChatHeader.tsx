// Chat header showing room info and participants
import React from "react";
import { RoomInfo } from "../../../hooks/useChat";

interface ChatHeaderProps {
  room: RoomInfo | undefined;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ room }) => {
  if (!room) return <div className="border-b p-4 font-semibold">Chat</div>;
  return (
    <div className="flex items-center justify-between border-b bg-white p-4">
      <div>
        <div className="text-lg font-semibold">
          {room.name || "Unnamed Room"}
        </div>
        <div className="text-xs text-gray-500">
          {room.type === "GROUP" ? "Group chat" : "Direct chat"} •{" "}
          {room.members.length} member{room.members.length !== 1 ? "s" : ""}
        </div>
      </div>
      {/* Optionally, add actions like add user, leave room, etc. */}
    </div>
  );
};

export default ChatHeader;
