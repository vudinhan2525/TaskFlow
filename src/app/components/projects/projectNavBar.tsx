import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaChartBar, FaListAlt, FaTh, FaCalendarAlt, FaCode, FaTasks, FaGlobe, FaUserPlus } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { useProject } from "../../../hooks/useProject";
import AddProjectMemberModal from "./modals/addProjectMemberModal";

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

const SortableNavItem: React.FC<SortableNavItemProps> = ({ item, isActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mr-1 ${isDragging ? "pointer-events-none" : "pointer-events-auto"}`}
      {...attributes}
      {...listeners}
    >
      <Link
        to={item.route}
        className={`flex items-center px-3 py-2 rounded transition-colors duration-200 no-underline
          ${
            isActive
              ? "bg-emerald-100 text-emerald-700 font-medium"
              : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
          }`}
      >
        <span className="text-base mr-2 text-emerald-700">{item.icon}</span>
        <span className="text-sm text-emerald-600">{item.label}</span>
      </Link>
    </div>
  );
};

const ProjectNavbar = (): React.ReactElement => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  useProject(projectId || ""); // Keep project synchronized

  const getNavItems = (currentProjectId: string): NavItem[] => [
    { id: "summary", label: "Summary", icon: <FaGlobe />, route: `/projects/${currentProjectId}/summary` },
    { id: "board", label: "Board", icon: <FaTh />, route: `/projects/${currentProjectId}/board` },
    { id: "backlog", label: "Backlog", icon: <FaTasks />, route: `/projects/${currentProjectId}/backlog` },
    { id: "list", label: "List", icon: <FaListAlt />, route: `/projects/${currentProjectId}/list` },
    { id: "roadmap", label: "Roadmap", icon: <FaChartBar />, route: `/projects/${currentProjectId}/roadmap` },
    { id: "sprints", label: "Sprints", icon: <FaCalendarAlt />, route: `/projects/${currentProjectId}/sprints` },
    { id: "reports", label: "Reports", icon: <FaChartBar />, route: `/projects/${currentProjectId}/reports` },
    { id: "settings", label: "Settings", icon: <FaCode />, route: `/projects/${currentProjectId}/settings` },
  ];

  const defaultItems = getNavItems(projectId || "");

  const [items, setItems] = useState<NavItem[]>(() => {
    const savedOrder = localStorage.getItem(`navbar-order-${projectId}`);
    if (savedOrder) {
      const orderIds: string[] = JSON.parse(savedOrder);
      return orderIds
        .map((id: string) => getNavItems(projectId || "").find((item) => item.id === id))
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
            .map((id: string) => getNavItems(projectId).find((item) => item.id === id))
            .filter(Boolean) as NavItem[]
        );
      } else {
        setItems(getNavItems(projectId));
      }
    }
  }, [projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Small distance for easier activation
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const newItems = arrayMove(
          items,
          items.findIndex((item) => item.id === active.id),
          items.findIndex((item) => item.id === over.id)
        );
        localStorage.setItem(`navbar-order-${projectId}`, JSON.stringify(newItems.map((item) => item.id)));
        return newItems;
      });
    }
  };

  return (
    <div id="project-navbar" className="flex flex-col bg-white p-2 border-b border-gray-200">
      <nav className="flex items-center overflow-x-auto whitespace-nowrap">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            {items.map((item) => (
              <SortableNavItem key={item.id} item={item} isActive={location.pathname === item.route} />
            ))}
          </SortableContext>
        </DndContext>
        <div
          onClick={() => setIsAddMemberModalOpen(true)}
          className="flex items-center ml-2 px-2 py-2 bg-emerald-100 rounded hover:bg-emerald-200 cursor-pointer"
          title="Add Project Member"
        >
          <FaUserPlus className="text-emerald-600" />
        </div>
      </nav>
      <AddProjectMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default ProjectNavbar;
