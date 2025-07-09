// Main chat page integrating room list, header, and chat box
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useChat, RoomInfo, MessageType } from "../../../hooks/useChat";
import ChatRoomList from "../../components/chat/ChatRoomList";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatBox from "../../components/chat/ChatBox";

const ChatPage: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const {
    rooms,
    messages,
    setCurrentRoom,
    joinRoom,
    sendMessage,
    loadHistory,
    loadingHistory,
    typingUsers,
    startTyping,
  } = useChat({
    userId: user?.id ?? "",
    userName: user ? user.first_name + " " + user.last_name : "",
  });

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Please log in to use chat.
      </div>
    );
  }

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const handleSelectRoom = (roomId: string) => {
    console.log("Joining roomId:", roomId);
    setSelectedRoomId(roomId);
    setCurrentRoom(roomId);
    joinRoom(roomId);
  };

  // Get messages for the selected room
  const selectedRoomMessages = selectedRoomId
    ? messages[selectedRoomId] || []
    : [];

  return (
    <div className="flex h-full">
      <ChatRoomList
        currentRoomId={selectedRoomId}
        onSelectRoom={handleSelectRoom}
      />
      <div className="flex h-full flex-1 flex-col">
        <ChatHeader room={selectedRoom} />
        {selectedRoomId ? (
          <ChatBox
            roomId={selectedRoomId}
            roomType={selectedRoom?.type as MessageType}
            roomName={selectedRoom?.name}
            messages={selectedRoomMessages}
            sendMessage={sendMessage}
            loadHistory={loadHistory}
            loadingHistory={loadingHistory}
            typingUsers={typingUsers}
            startTyping={startTyping}
            user={user}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
