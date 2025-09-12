import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaListAlt,
  FaTh,
  FaCalendarAlt,
  FaCode,
  FaTasks,
  FaGlobe,
  FaUserPlus,
} from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { useProject } from "../../../hooks/useProject";
import AddProjectMemberModal from "./modals/addProjectMemberModal";
import { useIssueStore } from "@libs/store/useIssueStore";
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  route: string;
}

interface SortableNavItemProps {
  item: NavItem;
  isActive: boolean;
}

const SortableNavItem: React.FC<SortableNavItemProps> = ({
  item,
  isActive,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "default",
    touchAction: "none",
  };
  const {closeIssueDetail} = useIssueStore();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full ${isDragging ? "pointer-events-none" : "pointer-events-auto"}`}
      {...attributes}
      {...listeners}
    >
      <Link
        to={item.route}
        onClick={()=>{
          closeIssueDetail();
        }}
        className={`group relative flex w-full items-center px-6 py-3 text-sm font-medium no-underline transition-all duration-150 ${
          isActive
            ? "border-green-600 bg-green-100 text-green-700 font-semibold"
            : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50 hover:text-green-700 hover:font-semibold"
        }`}
      >
        <span
          className={`mr-2 text-base transition-colors ${isActive ? "text-green-700" : "text-gray-500 group-hover:text-green-700 font-semibold"}`}
        >
          {item.icon}
        </span>
        <span className="whitespace-nowrap">{item.label}</span>
      </Link>
    </div>
  );
};

const ProjectNavbar = (): React.ReactElement => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const { project } = useProject(projectId || ""); // Assuming this returns project data

  const getNavItems = (currentProjectId: string): NavItem[] => [
    {
      id: "summary",
      label: "Summary",
      icon: <FaGlobe />,
      route: `/projects/${currentProjectId}/summary`,
    },
    {
      id: "board",
      label: "Board",
      icon: <FaTh />,
      route: `/projects/${currentProjectId}/board`,
    },
    {
      id: "backlog",
      label: "Backlog",
      icon: <FaTasks />,
      route: `/projects/${currentProjectId}/backlog`,
    },
    {
      id: "list",
      label: "List",
      icon: <FaListAlt />,
      route: `/projects/${currentProjectId}/list`,
    },
    {
      id: "roadmap",
      label: "Roadmap",
      icon: <FaCalendarAlt />,
      route: `/projects/${currentProjectId}/roadmap`,
    },
    {
      id: "sprints",
      label: "Sprints",
      icon: <FaChartBar />,
      route: `/projects/${currentProjectId}/sprints`,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaCode />,
      route: `/projects/${currentProjectId}/settings`,
    },
  ];

  const defaultItems = getNavItems(projectId || "");

  const [items, setItems] = useState<NavItem[]>(() => {
    const savedOrder = localStorage.getItem(`navbar-order-${projectId}`);
    if (savedOrder) {
      const orderIds: string[] = JSON.parse(savedOrder);
      return orderIds
        .map((id: string) =>
          getNavItems(projectId || "").find((item) => item.id === id),
        )
        .filter(Boolean) as NavItem[];
    }
    return defaultItems;
  });

  // Update items when project ID changes
  useEffect(() => {
    if (projectId) {
      const savedOrder = localStorage.getItem(`navbar-order-${projectId}`);
      if (savedOrder) {
        const orderIds: string[] = JSON.parse(savedOrder);
        setItems(
          orderIds
            .map((id: string) =>
              getNavItems(projectId).find((item) => item.id === id),
            )
            .filter(Boolean) as NavItem[],
        );
      } else {
        setItems(getNavItems(projectId));
      }
    }
  }, [projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const newItems = arrayMove(
          items,
          items.findIndex((item) => item.id === active.id),
          items.findIndex((item) => item.id === over.id),
        );
        localStorage.setItem(
          `navbar-order-${projectId}`,
          JSON.stringify(newItems.map((item) => item.id)),
        );
        return newItems;
      });
    }
  };
  return (
    <div className="flex h-full flex-col justify-between border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col space-y-6">
        {/* Project Header */}
        <div className=" p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Project Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded bg-green-600 text-sm font-semibold text-gray-50">
                {project?.name?.substring(0, 2)?.toUpperCase() || "PR"}
              </div>

              {/* Project Info */}
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-md font-bold text-gray-800">
                    {project?.name || "Project Name"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {project?.key || "PROJ"} • Software project
                  </p>
                </div>
              </div>
            </div>
            <button
              title="Invite Members to Project"
              onClick={() => setIsAddMemberModalOpen(true)}
              className="flex cursor-pointer items-center space-x-2 text-gray-500 duration-300 hover:scale-110"
            >
              <FaUserPlus className="mr-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full">
          <nav className="scrollbar-hide nav-item flex w-full flex-col items-center space-x-1">
            <DndContext
              onDragEnd={handleDragEnd}
              sensors={sensors}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableNavItem
                    key={item.id}
                    item={item}
                    isActive={location.pathname === item.route}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </nav>
        </div>
      </div>

      <div></div>

      <AddProjectMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default ProjectNavbar;
