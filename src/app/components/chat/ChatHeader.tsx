// ChatHeader.tsx
import React from "react";
import { RoomInfo } from "../../../hooks/apis/useChat";

interface ChatHeaderProps {
  room: RoomInfo | undefined;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ room }) => {
  if (!room)
    return (
      <div className="border-b bg-white p-4 font-semibold text-green-700">
        Select a chat
      </div>
    );

  return (
    <div className="border-b border-green-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white">
          {room.name?.charAt(0).toUpperCase() || "R"}
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {room.name || "Unnamed Room"}
          </div>
          <div className="text-sm text-green-600">
            {room.type === "GROUP" ? "Group" : "Direct"} • {room.members.length}{" "}
            member{room.members.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
