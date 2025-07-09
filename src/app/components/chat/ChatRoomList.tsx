// Sidebar for listing chat rooms and switching between them
import React, { useEffect } from "react";
import { RoomInfo, useChat } from "../../../hooks/useChat";

interface ChatRoomListProps {
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
  currentRoomId,
  onSelectRoom,
}) => {
  const { rooms, fetchRooms, connected } = useChat({
    userId: "",
    userName: "",
  });

  useEffect(() => {
    if (connected) {
      fetchRooms();
    }
    // eslint-disable-next-line
  }, [connected, fetchRooms]);

  console.log("rooms in ChatRoomList", rooms);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      <div className="flex items-center justify-between border-b p-4 font-bold">
        <span>Chats</span>
        <button
          className="text-xs text-blue-500 hover:underline"
          onClick={fetchRooms}
          title="Reload chat rooms"
        >
          Reload
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 && (
          <div className="mt-8 text-center text-gray-400">
            No conversations
            <button
              className="mx-auto mt-2 block text-xs text-blue-500 hover:underline"
              onClick={fetchRooms}
            >
              Reload
            </button>
          </div>
        )}
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`cursor-pointer px-4 py-3 hover:bg-blue-50 ${
              currentRoomId === room.id ? "bg-blue-100 font-semibold" : ""
            }`}
            onClick={() => onSelectRoom(room.id)}
          >
            <div className="flex items-center gap-2">
              <span className="truncate">{room.name || "Unnamed Room"}</span>
              <span className="text-xs text-gray-400">
                {room.type === "GROUP" ? "Group" : "Direct"}
              </span>
            </div>
            <div className="truncate text-xs text-gray-500">
              {room.members.length} member{room.members.length !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;
