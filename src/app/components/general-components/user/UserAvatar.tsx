import { useUserById } from "@libs/hooks/useUser";
import Avatar from "react-avatar";
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
          className="rounded-full bg-gray-200 p-1 flex items-center justify-center"
        >
          <FaUserAltSlash />
        </div>
        <span className="text-sm font-medium text-gray-700">Unasigned</span>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center gap-2">
      <Avatar
        name={user?.first_name + " " + user?.last_name}
        size={`${size}`}
        round={true}
      />
      {isDisplayName && (
        <p className="text-sm font-medium text-gray-700">
          {user?.first_name + " " + user?.last_name}
        </p>
      )}
    </div>
  );
}
