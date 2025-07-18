import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat, RoomInfo, MessageType } from "../../../hooks/useChat";
import ChatRoomList from "../../components/chat/ChatRoomList";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatBox from "../../components/chat/ChatBox";
import { Modal, Input, Select, Button } from "antd";
import axios from "axios";

const { Option } = Select;

const ChatPage: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token); // Get auth token
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState<MessageType>("DIRECT");
  const [newRoomMembers, setNewRoomMembers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<
    { id: string; name: string }[]
  >([]);

  const {
    rooms,
    messages,
    connectionError,
    setCurrentRoom,
    joinRoom,
    sendMessage,
    createRoom,
    loadHistory,
    loadingHistory,
    typingUsers,
    startTyping,
    fetchRooms,
  } = useChat({
    userId: user?.id ?? "",
    userName: user ? user.first_name + " " + user.last_name : "",
    authToken: token, // Pass token to useChat
  });

  // Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableUsers(
          response.data.map((u: any) => ({
            id: u.id,
            name: `${u.first_name} ${u.last_name}`,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    if (user && token) {
      fetchUsers();
    }
  }, [user, token]);

  console.log("ChatPage rooms:", rooms);
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

  const handleRetry = () => {
    console.log("Retrying fetchRooms...");
    fetchRooms();
  };

  const handleCreateChat = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateRoom = () => {
    if (!newRoomName || newRoomMembers.length === 0) {
      console.error("Room name and members are required");
      return;
    }
    createRoom(newRoomName, newRoomType, [...newRoomMembers, user.id]);
    setIsCreateModalVisible(false);
    setNewRoomName("");
    setNewRoomType("DIRECT");
    setNewRoomMembers([]);
  };

  const selectedRoomMessages = selectedRoomId
    ? messages[selectedRoomId] || []
    : [];

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="w-full border-r bg-gray-50 md:w-1/4">
        {connectionError ? (
          <div className="flex h-full flex-col items-center justify-center text-red-500">
            <p>{connectionError}</p>
            <button
              className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        ) : rooms.length > 0 ? (
          <ChatRoomList
            currentRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <p>No chats available</p>
            <button
              className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={handleCreateChat}
            >
              Create a new chat
            </button>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col md:w-3/4">
        {selectedRoomId ? (
          <>
            <ChatHeader room={selectedRoom} />
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
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
      <Modal
        title="Create New Chat"
        open={isCreateModalVisible}
        onOk={handleCreateRoom}
        onCancel={() => setIsCreateModalVisible(false)}
        okText="Create"
        cancelText="Cancel"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Chat Name
          </label>
          <Input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter chat name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Chat Type
          </label>
          <Select
            value={newRoomType}
            onChange={(value) => setNewRoomType(value)}
            className="w-full"
          >
            <Option value="DIRECT">Direct</Option>
            <Option value="GROUP">Group</Option>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Members
          </label>
          <Select
            mode="multiple"
            value={newRoomMembers}
            onChange={(value) => setNewRoomMembers(value)}
            placeholder="Select members"
            className="w-full"
          >
            {availableUsers.map((u) => (
              <Option key={u.id} value={u.id}>
                {u.name}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default ChatPage;
