import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { LuBookmark, LuBug, LuClipboardCheck, LuStar } from "react-icons/lu";
import { CiAt } from "react-icons/ci";
import {
  MdOutlineBedroomParent,
  // MdLabelImportantOutline,
  MdOutlineSubtitles,
  MdOutlineSummarize,
  MdOutlineDescription,
} from "react-icons/md";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import { IIssue } from "@libs/types/issue";
// import { RiTeamFill } from "react-icons/ri";
import { IoIosPrint } from "react-icons/io";
import { LuCircleArrowRight } from "react-icons/lu";
import { CiCircleChevUp } from "react-icons/ci";

export const columnsIcon: Record<keyof Omit<IIssue, "key">, React.ReactNode> = {
  id: <FaPlus color="#626f86" />,
  project_id: <FaPlus color="#626f86" />,
  title: <MdOutlineSubtitles color="#626f86" />,
  summary: <MdOutlineSummarize color="#626f86" />,
  description: <MdOutlineDescription color="#626f86" />,
  column: <LuCircleArrowRight color="#626f86" />,
  priority: <CiCircleChevUp color="#626f86" />,
  type: <div />,
  sprint_id: <IoIosPrint color="#626f86" />,
  assignee_id: <CiAt color="#626f86" />,
  reporter_id: <CiAt color="#626f86" />,
  parent_id: <MdOutlineBedroomParent color="#626f86" />,
  story_point: <FcHighPriority color="#626f86" />,
  attachments: <FaPlus color="#626f86" />,
  created_at: <FaCalendarAlt color="#626f86" />,
  updated_at: <FaCalendarAlt color="#626f86" />,
  due_date_from: <FaCalendarAlt color="#626f86" />,
  due_date_to: <FaCalendarAlt color="#626f86" />,
  completed_at: <FaCalendarAlt color="#626f86" />,
  // status: <FaCalendarAlt color="#626f86" />,
  // labels: <MdLabelImportantOutline color="#626f86" />,
  // team_id: <RiTeamFill color="#626f86" />,
};

export const typeOptions = [
  {
    id: "Bug",
    name: "Bug",
    icon: <LuBug className="h-4 w-4 text-red-500" />,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    id: "Task",
    name: "Task",
    icon: <LuClipboardCheck className="h-4 w-4 text-blue-500" />,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    id: "Story",
    name: "Story",
    icon: <LuBookmark className="h-4 w-4 text-green-500" />,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    id: "Epic",
    name: "Epic",
    icon: <LuStar className="h-4 w-4 text-purple-500" />,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
];

export const priorityOptions = [
  { name: "High", icon: <FcHighPriority size={20} /> },
  { name: "Medium", icon: <FcMediumPriority size={20} /> },
  { name: "Low", icon: <FcLowPriority size={20} /> },
];

export const statusOptions = [
  {
    label: "TO DO",
    key: "TO DO",
    order: 1,
    textColor: "text-gray-600",
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
  },
  {
    label: "IN PROGRESS",
    key: "IN PROGRESS",
    order: 2,
    textColor: "text-blue-600",
    dotColor: "bg-blue-400",
    bgColor: "bg-blue-100",
  },
  {
    label: "DONE",
    key: "DONE",
    order: 3,
    textColor: "text-green-600",
    dotColor: "bg-green-400",
    bgColor: "bg-green-100",
  },
];
