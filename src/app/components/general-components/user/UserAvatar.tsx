import { useUserById } from "@libs/hooks/useUser";
import { Avatar } from "antd";
import { FaUserAltSlash } from "react-icons/fa";

export default function UserAvatar({
  userId,
  size = 28,
  isDisplayName = true,
}: {
  userId?: string;
  size?: number;
  isDisplayName?: boolean;
}) {
  const { user } = useUserById(userId || "");

  if (!userId) {
    return (
      <div className="flex flex-row items-center justify-start gap-2">
        <div
          style={{ width: size, height: size }}
          className="flex items-center justify-center rounded-full bg-gray-200 p-1"
        >
          <FaUserAltSlash />
        </div>
        {isDisplayName && (
          <span className="text-sm font-medium text-gray-700">Unasigned</span>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center gap-2">
      <Avatar
        size={size}
        shape="circle"
        style={{
          backgroundColor: "rgba(161, 157, 157)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${Math.floor(size / 2.5)}px`,
          fontWeight: 500,
          textTransform: "uppercase",
          border: "2px solid white"
        }}
      >
        {user?.first_name?.[0]}
        {user?.last_name?.[0]}
      </Avatar>
      {isDisplayName && (
        <p className="text-sm font-medium text-gray-700">
          {user?.first_name + " " + user?.last_name}
        </p>
      )}
    </div>
  );
}
