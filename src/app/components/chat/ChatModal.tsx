// import React from "react";
// import { useSelector } from "react-redux";
// // import { ChatContainer } from "./ChatBox";
// import { MessageType } from "../../../hooks/useChat";

// interface ChatModalProps {
//   roomId: string;
//   roomType: MessageType;
//   roomName?: string;
//   onClose: () => void;
//   style?: React.CSSProperties;
// }

// const ChatModal: React.FC<ChatModalProps> = ({
//   roomId,
//   roomType,
//   roomName,
//   onClose,
//   style = {},
// }) => {
//   const user = useSelector((state: any) => state.auth.user);
//   const {
//     messages,
//     sendMessage,
//     loadHistory,
//     loadingHistory,
//     typingUsers,
//     startTyping,
//     joinRoom,
//     setCurrentRoom,
//   } = useChat({
//     userId: user?.id ?? "",
//     userName: user ? user.first_name + " " + user.last_name : "",
//   });

//   return (
//     <ChatContainer
//       roomId={roomId}
//       roomType={roomType}
//       roomName={roomName}
//       messages={messages[roomId] || []}
//       sendMessage={sendMessage}
//       loadHistory={loadHistory}
//       loadingHistory={loadingHistory}
//       typingUsers={typingUsers}
//       start၇
//       startTyping={startTyping}
//       user={user}
//       isModal={true}
//       onClose={onClose}
//       style={style}
//     />
//   );
// };

// export default ChatModal;
