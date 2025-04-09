import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaRocket, FaChartBar, FaListAlt, FaTh, FaCalendarAlt, FaCode, FaPlus, FaTasks, FaGlobe } from "react-icons/fa";
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="mr-1">
      <Link
        to={item.route}
        onClick={handleClick}
        className={`flex items-center px-3 py-2 rounded cursor-grab transition-colors duration-200 no-underline
          ${
            isActive
              ? "bg-emerald-100 text-emerald-700 font-medium"
              : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
          }`}
        {...attributes}
        {...listeners}
      >
        <span className="text-base mr-2 text-emerald-700">{item.icon}</span>
        <span className="text-sm text-emerald-600">{item.label}</span>
      </Link>
    </div>
  );
};

const ProjectNavbar = (): React.ReactElement => {
  const { projectKey } = useParams<{ projectKey: string }>();
  const location = useLocation();

  const [items, setItems] = useState<NavItem[]>([
    { id: "summary", label: "Summary", icon: <FaGlobe />, route: `/projects/${projectKey}/summary` },
    { id: "board", label: "Board", icon: <FaTh />, route: `/projects/${projectKey}/board` },
    { id: "backlog", label: "Backlog", icon: <FaTasks />, route: `/projects/${projectKey}/backlog` },
    { id: "list", label: "List", icon: <FaListAlt />, route: `/projects/${projectKey}/list` },
    { id: "roadmap", label: "Roadmap", icon: <FaChartBar />, route: `/projects/${projectKey}/roadmap` },
    { id: "sprints", label: "Sprints", icon: <FaCalendarAlt />, route: `/projects/${projectKey}/sprints` },
    { id: "reports", label: "Reports", icon: <FaChartBar />, route: `/projects/${projectKey}/reports` },
    { id: "settings", label: "Settings", icon: <FaCode />, route: `/projects/${projectKey}/settings` },
  ]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex flex-col bg-white p-2 border-b border-gray-200">
      {/* Project Header */}
      <div className="flex items-center mb-2">
        <FaRocket className="text-emerald-600 text-xl mr-2" />
        <span className="text-base font-semibold text-gray-800">TaskFlow</span>
        <span className="ml-1 text-gray-500">...</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex items-center overflow-x-auto whitespace-nowrap">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            {items.map((item) => (
              <SortableNavItem key={item.id} item={item} isActive={location.pathname === item.route} />
            ))}
          </SortableContext>
        </DndContext>
        <div className="flex items-center px-2 py-2 bg-emerald-100 rounded hover:bg-emerald-200 cursor-pointer">
          <FaPlus className="text-emerald-600" />
        </div>
      </nav>
    </div>
  );
};

export default ProjectNavbar;
