// ChatRoomList.tsx
import React, { useState } from "react";
import { RoomInfo } from "@libs/hooks/apis/useChat";
import { useDebounce } from "./useDebounce";
interface ChatRoomListProps {
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onAddRoom?: () => void;
  rooms: RoomInfo[];
  onReload?: () => void;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
  currentRoomId,
  onSelectRoom,
  onAddRoom,
  rooms,
  onReload,
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const filteredRooms = rooms.filter((room) =>
    room.name?.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col border-r border-green-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600 p-4 font-bold text-white">
        <span>Chats</span>
        <button onClick={onReload} className="text-sm hover:underline">
          🔄
        </button>
      </div>

      {/* Search */}
      <div className="bg-green-50 p-3">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-green-300 px-3 py-2 focus:ring focus:ring-green-200 focus:outline-none"
        />
      </div>

      {/* Rooms */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No chats found</div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`m-1 mx-2 flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-green-100 ${
                currentRoomId === room.id ? "bg-green-200 font-semibold" : ""
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white">
                {room.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">
                  {room.name || "Unnamed"}
                </div>
                <div className="text-xs text-gray-500">
                  {room.members.length} member
                  {room.members.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Room Button */}
      {onAddRoom && (
        <button
          onClick={onAddRoom}
          className="m-3 rounded-full bg-green-500 py-2 font-bold text-white transition hover:bg-green-600"
        >
          + New Chat
        </button>
      )}
    </div>
  );
};

export default ChatRoomList;
