// Sidebar for listing chat rooms and switching between them
import React, { useEffect, useState } from "react";
import { RoomInfo, useChat } from "../../../hooks/useChat";
import { useDebounce } from "./useDebounce";

interface ChatRoomListProps {
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onAddRoom?: () => void;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
  currentRoomId,
  onSelectRoom,
  onAddRoom,
}) => {
  const { rooms, fetchRooms, connected } = useChat({
    userId: "",
    userName: "",
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (connected) {
      fetchRooms();
    }
    // eslint-disable-next-line
  }, [connected, fetchRooms]);
  console.log("ChatRoomList rooms:", rooms);
  if (rooms && rooms.length > 0) {
    rooms.forEach((room, idx) => {
      console.log(
        `[Room ${idx}] id: ${room.id}, name: ${room.name}, type: ${room.type}, members:`,
        room.members,
      );
    });
  } else {
    console.log("No rooms received for current user.");
  }
  // Filter rooms by debounced search
  const filteredRooms = rooms.filter((room) => {
    if (room.type === "GROUP") {
      return room.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
    } else {
      // For direct, show the other user's name (assuming room.name is the other user's name)
      return room.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
    }
  });

  return (
    <div className="flex h-full flex-col border-r bg-gray-50">
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
      <div className="flex items-center gap-2 border-b bg-white p-2">
        <input
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="ml-1 rounded bg-blue-500 px-2 py-1 text-lg text-white hover:bg-blue-600"
          title="Add new chat"
          onClick={onAddRoom}
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 && (
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
        {filteredRooms.map((room) => (
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
