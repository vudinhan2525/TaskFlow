<<<<<<< Updated upstream
import Avatar from "react-avatar";
import { useUserById } from "@libs/hooks/useUser";

const UserAvatar = ({
  userId,
  isDisplayName = true,
}: {
  userId?: string;
  isDisplayName?: boolean;
}) => {
  const { user } = useUserById(userId || "");
  return (
    <div className={`flex items-center gap-2`}>
      <Avatar
        name={userId && user?.first_name + " " + user?.last_name}
        size="25"
        round={true}
      />

      {isDisplayName && (
        <span className="text-gray-400">
          {userId ? user?.first_name + " " + user?.last_name : "Unassigned"}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
=======
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
>>>>>>> Stashed changes
