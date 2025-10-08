import { ITeam } from "@libs/types/team";
import { Users } from "lucide-react";

export const teamColors = [
  {
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-100",
    hoverBg: "hover:bg-blue-50",
  },
  {
    textColor: "text-green-700",
    dotColor: "bg-green-500",
    bgColor: "bg-green-100",
    hoverBg: "hover:bg-green-50",
  },
  {
    textColor: "text-purple-700",
    dotColor: "bg-purple-500",
    bgColor: "bg-purple-100",
    hoverBg: "hover:bg-purple-50",
  },
  {
    textColor: "text-orange-700",
    dotColor: "bg-orange-500",
    bgColor: "bg-orange-100",
    hoverBg: "hover:bg-orange-50",
  },
  {
    textColor: "text-pink-700",
    dotColor: "bg-pink-500",
    bgColor: "bg-pink-100",
    hoverBg: "hover:bg-pink-50",
  },
  {
    textColor: "text-indigo-700",
    dotColor: "bg-indigo-500",
    bgColor: "bg-indigo-100",
    hoverBg: "hover:bg-indigo-50",
  },
  {
    textColor: "text-teal-700",
    dotColor: "bg-teal-500",
    bgColor: "bg-teal-100",
    hoverBg: "hover:bg-teal-50",
  },
  {
    textColor: "text-cyan-700",
    dotColor: "bg-cyan-500",
    bgColor: "bg-cyan-100",
    hoverBg: "hover:bg-cyan-50",
  },
];

const sizeClasses = {
  small: {
    button: "px-2 py-0.5 text-xs",
    icon: "w-3 h-3",
  },
  medium: {
    button: "px-3 py-1 text-sm",
    icon: "w-4 h-4",
  },
  large: {
    button: "px-4 py-1.5 text-base",
    icon: "w-5 h-5",
  },
};

const TeamBadge = ({
  team,
  size = "small",
  className,
  isShowLabel = true,
}: {
  team: ITeam;
  size?: "small" | "medium" | "large";
  className?: string;
  isShowLabel?: boolean;
}) => {
  if (!team) return <></>;

  // Use team ID to get consistent color
  const colorIndex = team.id.charCodeAt(0) % teamColors.length;
  const selectedColor = teamColors[colorIndex];

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl transition-colors duration-200 ${selectedColor.hoverBg} ${className}`}
    >
      <div
        className={`rounded-2xl ${selectedColor.bgColor} flex items-center gap-1 ${sizeClasses[size].button}`}
      >
        <Users
          className={`${sizeClasses[size].icon} ${selectedColor.textColor}`}
        />
        {isShowLabel && (
          <p className={`truncate font-semibold ${selectedColor.textColor}`}>
            {team.name || "Unnamed Team"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamBadge;
