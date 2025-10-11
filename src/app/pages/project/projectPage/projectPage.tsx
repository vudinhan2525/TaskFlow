import Button from "@libs/app/components/general-components/button";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ProjectStat from "@libs/app/components/projects/dashboard/projectStat";
import ProjectTable from "@libs/app/components/projects/dashboard/projectTable";
import ProjectDeadlines from "@libs/app/components/projects/dashboard/projectDeadlines";
import CreateProjectModal from "@libs/app/components/projects/modals/createProjectModal";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Input,
  Badge,
  Dropdown,
  Progress,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  Typography,
  Button as ButtonAntd,
} from "antd";
import type { MenuProps } from "antd";
import {
  Search,
  Plus,
  Bell,
  Settings,
  User,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Folder,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const { Title, Text, Paragraph } = Typography;

const projects = [
  {
    id: 1,
    name: "BlueSky",
    key: "BS",
    description: "E-commerce platform redesign",
    type: "Software",
    status: "active",
    progress: 68,
    members: 8,
    issues: 24,
    dueDate: "2025-11-15",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Task Flow",
    key: "TF",
    description: "Project management tool",
    type: "Software",
    status: "active",
    progress: 45,
    members: 5,
    issues: 49,
    dueDate: "2025-12-01",
    color: "#10b981",
  },
  {
    id: 3,
    name: "Mobile App",
    key: "MA",
    description: "iOS and Android application",
    type: "Mobile",
    status: "active",
    progress: 82,
    members: 6,
    issues: 12,
    dueDate: "2025-10-20",
    color: "#a855f7",
  },
  {
    id: 4,
    name: "Dashboard Analytics",
    key: "DA",
    description: "Real-time analytics dashboard",
    type: "Software",
    status: "active",
    progress: 34,
    members: 4,
    issues: 31,
    dueDate: "2025-11-30",
    color: "#f97316",
  },
  {
    id: 5,
    name: "Marketing Site",
    key: "MS",
    description: "Company website redesign",
    type: "Web",
    status: "completed",
    progress: 100,
    members: 3,
    issues: 0,
    dueDate: "2025-09-15",
    color: "#22c55e",
  },
  {
    id: 6,
    name: "API Gateway",
    key: "AG",
    description: "Microservices API gateway",
    type: "Backend",
    status: "active",
    progress: 56,
    members: 7,
    issues: 18,
    dueDate: "2025-12-15",
    color: "#06b6d4",
  },
];

const upcomingDeadlines = [
  {
    project: "E-commerce Platform",
    dueIn: "2 days",
    color: "#10b981",
  },
  {
    project: "Mobile App Redesign",
    dueIn: "5 days",
    color: "#f97316",
  },
  {
    project: "Dashboard Analytics",
    dueIn: "1 week",
    color: "#3b82f6",
  },
];
const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function ProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [option, setOption] = useState(filterOptions[0]);

  const [sortBy, setSortBy] = useState("newest");

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const upcomingProjects = projects.filter((p) => {
    const dueDate = new Date(p.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilDue <= 7 && daysUntilDue > 0;
  }).length;

  const projectMenuItems: MenuProps["items"] = [
    { key: "all", label: "All Projects" },
    { key: "my", label: "My Projects" },
    { key: "archived", label: "Archived" },
  ];

  const sortMenuItems: MenuProps["items"] = [
    { key: "newest", label: "Newest" },
    { key: "oldest", label: "Oldest" },
    { key: "name", label: "Name" },
  ];

  const projectActionItems: MenuProps["items"] = [
    { key: "view", label: "View Details" },
    { key: "edit", label: "Edit Project" },
    { key: "archive", label: "Archive" },
    { key: "delete", label: "Delete", danger: true },
  ];
  return (
    <div className="">
      <Helmet>
        <title>Projects - Task Flow</title>
      </Helmet>
      <div className="basis-[70%]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <Button onClick={() => setShowCreateProjectModal(true)}>
            Create Project
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="relative w-[280px]">
            <input
              type="text"
              placeholder="Search for project..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-[#1447e6]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaMagnifyingGlass className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
          </div>
          <DropdownAntd
            options={filterOptions}
            placement="bottom"
            onClickItem={(value) => setOption(value)}
            menuClassName={"min-w-[140px]"}
            rowClassName="text-base text-gray-700 py-[8px]"
            className={"min-w-[120px] !py-2"}
            parent={option.label}
          />
        </div>

        <div className="mt-6">
          <ProjectTable />
        </div>
      </div>

      <div className="basis-[30%]">
        <ProjectStat />

        <ProjectDeadlines />
      </div>
      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => {
          setShowCreateProjectModal(false);
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <main style={{ flex: 1, overflow: "auto", padding: 32 }}>
            {/* Page Header */}
            <div
              style={{
                marginBottom: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Projects
                </Title>
                <Text type="secondary">
                  Manage and track all your projects in one place
                </Text>
              </div>
              <ButtonAntd
                type="primary"
                icon={<Plus size={16} />}
                size="large"
                style={{ background: "#10b981", borderColor: "#10b981" }}
              >
                Create Project
              </ButtonAntd>
            </div>

            {/* Search and Filter */}
            <Space style={{ marginBottom: 24 }} size="middle">
              <Input
                placeholder="Search for project..."
                prefix={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 300, background: "#fafafa" }}
              />
              <Dropdown
                menu={{
                  items: sortMenuItems,
                  onClick: ({ key }) => setSortBy(key),
                }}
              >
                <Button>
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "oldest"
                      ? "Oldest"
                      : "Name"}{" "}
                  <ChevronDown size={16} style={{ marginLeft: 4 }} />
                </Button>
              </Dropdown>
            </Space>

            <Row gutter={[24, 24]}>
              {projects.map((project) => (
                <Col xs={24} md={12} lg={8} key={project.id}>
                  <Card
                    hoverable
                    style={{ height: "100%" }}
                    styles={{ body: { padding: 24 } }}
                    extra={
                      <Dropdown menu={{ items: projectActionItems }}>
                        <ButtonAntd
                          type="text"
                          icon={<MoreHorizontal size={16} />}
                        />
                      </Dropdown>
                    }
                  >
                    {/* Project Header */}
                    <Space style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: project.color,
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 18,
                        }}
                      >
                        {project.key}
                      </div>
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {project.name}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {project.type}
                        </Text>
                      </div>
                    </Space>

                    {/* Description */}
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      type="secondary"
                      style={{ marginBottom: 16, minHeight: 40 }}
                    >
                      {project.description}
                    </Paragraph>

                    {/* Progress */}
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Progress
                        </Text>
                        <Text strong style={{ fontSize: 12 }}>
                          {project.progress}%
                        </Text>
                      </div>
                      <Progress
                        percent={project.progress}
                        strokeColor={project.color}
                        showInfo={false}
                      />
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 16,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <Space size="large">
                        <Space size={4}>
                          <Folder size={14} style={{ color: "#8c8c8c" }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {project.issues} issues
                          </Text>
                        </Space>
                        <Space size={4}>
                          <User size={14} style={{ color: "#8c8c8c" }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {project.members}
                          </Text>
                        </Space>
                      </Space>
                      <Tag
                        icon={
                          project.status === "active" ? (
                            <Clock size={12} />
                          ) : (
                            <CheckCircle size={12} />
                          )
                        }
                        color={
                          project.status === "active" ? "processing" : "success"
                        }
                      >
                        {project.status}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </main>

          <aside
            style={{
              width: 320,
              borderLeft: "1px solid #f0f0f0",
              background: "#fff",
              overflow: "auto",
              padding: 24,
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Project Statistics */}
              <div>
                <Space style={{ marginBottom: 16 }}>
                  <TrendingUp size={20} style={{ color: "#10b981" }} />
                  <Title level={5} style={{ margin: 0 }}>
                    Project Statistics
                  </Title>
                </Space>

                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <Statistic
                        title="Total Projects"
                        value={projects.length}
                        valueStyle={{ fontSize: 24 }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <Statistic
                        title="Active"
                        value={activeProjects}
                        valueStyle={{ fontSize: 24, color: "#10b981" }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#f0fdf9",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <Statistic
                        title="Completed"
                        value={completedProjects}
                        valueStyle={{ fontSize: 24, color: "#22c55e" }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#fff7ed",
                        border: "1px solid #fed7aa",
                      }}
                    >
                      <Statistic
                        title="Upcoming"
                        value={upcomingProjects}
                        valueStyle={{ fontSize: 24, color: "#f97316" }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Upcoming Deadlines */}
              <div>
                <Space style={{ marginBottom: 16 }}>
                  <Calendar size={20} style={{ color: "#10b981" }} />
                  <Title level={5} style={{ margin: 0 }}>
                    Upcoming Deadlines
                  </Title>
                </Space>

                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {upcomingDeadlines.map((deadline, index) => (
                    <Card key={index} size="small" hoverable>
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Space>
                          <div
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: deadline.color,
                            }}
                          />
                          <div>
                            <Text strong style={{ fontSize: 14 }}>
                              {deadline.project}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Due in {deadline.dueIn}
                            </Text>
                          </div>
                        </Space>
                        <AlertTriangle size={16} style={{ color: "#f97316" }} />
                      </Space>
                    </Card>
                  ))}
                </Space>

                <Button
                  type="link"
                  block
                  style={{ marginTop: 16, color: "#10b981" }}
                >
                  View All Deadlines
                </Button>
              </div>

              {/* Quick Actions */}
              <div>
                <Title level={5} style={{ marginBottom: 16 }}>
                  Quick Actions
                </Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <ButtonAntd
                    block
                    icon={<Plus size={16} />}
                    style={{ textAlign: "left" }}
                  >
                    Create New Project
                  </ButtonAntd>
                  <ButtonAntd
                    block
                    icon={<Folder size={16} />}
                    style={{ textAlign: "left" }}
                  >
                    View Archived
                  </ButtonAntd>
                  <ButtonAntd
                    block
                    icon={<Settings size={16} />}
                    style={{ textAlign: "left" }}
                  >
                    Project Settings
                  </ButtonAntd>
                </Space>
              </div>
            </Space>
          </aside>
        </div>
      </div>
    </div>
  );
}
