
import { useUserById } from "@libs/hooks/useUser";
import Avatar from "react-avatar";

export default function UserAvatar({
  userId,
  size=28,
  isDisplayName = true,
}: {
  userId?: string;
  size?: number;
  isDisplayName?: boolean;
}) {
  const { user } = useUserById(userId || "");

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
