import React, { useState, useRef } from "react";
import {
  FaPlus,
} from "react-icons/fa";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { toast } from "react-toastify";
import { formatDate } from "@libs/utils/date";
import ActivityIssue from "@libs/app/components/issues/activityIssue";
import { useNavigate } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import TextEditor from "../projects/backlog/textEditor";
import { TbHexagon3D } from "react-icons/tb";
import AttachmentCard from "../projects/backlog/attachmentCard";
import { uploadFileToCloudinary } from "@libs/utils/uploadFileToCloud";
import Details from "../projects/backlog/details";


const IssueSideBar: React.FC = () => {
  const { selectedIssue, setSelectedIssue } = useIssueSelection();
  const IssueSideBarHeader = [
    {
      key: "lock",
      icon: <IoLockClosedOutline />,
      label: "Lock Issue",
      onClick: () => {
        toast.info("Lock issue not implemented yet");
      },
    },
    {
      key: "watch",
      icon: <FaEye />,
      label: "Watch Issue",
      onClick: () => {
        toast.info("Watch issue not implemented yet");
      },
    },
    // {
    //   key: "like",
    //   icon: <AiOutlineLike />,
    //   label: "Like Issue",
    //   onClick: () => {
    //     toast.info("Like issue not implemented yet");
    //   },
    // },
    {
      key: "share",
      icon: <CiShare2 />,
      label: "Share Issue",
      onClick: () => {
        toast.info("Share issue not implemented yet");
      },
    },
    {
      key: "actions",
      icon: <BsThreeDots />,
      label: "Actions",
      onClick: () => {
        toast.info("Actions not implemented yet");
      },
    },
    {
      key: "close",
      icon: <IoIosClose />,
      label: "Close Issue",
      onClick: () => {
        setSelectedIssue(null);
        navigate(`/projects/${selectedIssue?.project_id}/backlog`);
      },
    },
  ];
  const navigate = useNavigate();
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });
  const { sprints } = useProjectSprints(selectedIssue?.project_id || "");
  const [summary, setSummary] = useState(selectedIssue?.summary || "");
  const [isShowingTextEditor, setIsShowingTextEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!selectedIssue) return null;

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file?.type.includes("image")) {
      const response = await uploadFileToCloudinary(undefined, file);
      const newAttachment = {
        url: response,
        type: file.type,
        uploadFrom: "attachment",
        created_at: new Date().toISOString(),
      };
      await updateIssueAsync({
        id: selectedIssue.id,
        data: {
          attachments: [
            ...selectedIssue.attachments,
            JSON.stringify(newAttachment),
          ],
        },
      });
    }
  };

  const handleUpdateIssue = async (key: string, value: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: {
          [key]: value,
        },
      });
    } catch {
      toast.error("Failed to update issue");
    }
  };

  const handleDeleteAttachment = async (attachment: string) => {
    await updateIssueAsync({
      id: selectedIssue.id,
      data: {
        attachments: selectedIssue.attachments.filter(
          (a) => JSON.parse(a).url !== attachment,
        ),
      },
    });
  };

  return (
    <div className="z-30 flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto border-l border-gray-200 bg-white p-4 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xl text-gray-600 font-semibold">
              {selectedIssue?.title}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {IssueSideBarHeader.map((item) => (
            <div
              key={item.key}
              onClick={item.onClick}
              className="cursor-pointer rounded-sm border-1 border-gray-300 p-1.5 hover:bg-gray-100"
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-x-auto">
        {/* Summary */}
        <div className="wiki flex items-center justify-between">
          <input
            type="text"
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
            }}
            onBlur={() => {
              if (summary !== selectedIssue?.summary) {
                handleUpdateIssue("summary", summary);
              }
            }}
            className="w-full cursor-pointer rounded border-2 
            border-transparent bg-transparent p-2 text-sm font-semibold text-gray-500 outline-none hover:bg-gray-200 focus:border-emerald-500"
          />
        </div>
        <div className="flex flex-row gap-2">
          <button className="flex cursor-pointer items-center gap-2 rounded-sm border-1 border-gray-300 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200">
            <FaPlus />
            <span className="text-sm font-medium text-gray-800">Add</span>
          </button>
          <button className="flex cursor-pointer items-center gap-2 rounded-sm border-1 border-gray-300 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200">
            <TbHexagon3D />
            <span className="text-sm font-medium text-gray-800">Apps</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="flex w-full flex-col items-start gap-1">
        <p className="text-sm font-bold text-gray-600 py-1">Description</p>

        {isShowingTextEditor ? (
          <TextEditor
            initialDeltaString={selectedIssue?.description || ""}
            issueId={selectedIssue?.id || ""}
            projectId={selectedIssue?.project_id || ""}
            attachments={selectedIssue?.attachments || []}
            handleClose={() => {
              setIsShowingTextEditor(false);
            }}
          />
        ) : (
          <input
            value={
              selectedIssue?.description && selectedIssue.description[0] === '{'
                ? JSON.parse(selectedIssue?.description || "{}")?.plainText
                : selectedIssue?.description
            }
            readOnly
            onClick={() => {
              setIsShowingTextEditor(true);
            }}
            placeholder="Add a description"
            className="w-full rounded border border-gray-300 p-2 text-sm outline-none hover:bg-gray-100 focus:border-emerald-500 cursor-pointer"
          />
        )}
      </div>

      {/* Attachments */}
      {selectedIssue.attachments.length ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-1">
              <p className="text-sm font-bold text-gray-600">Attachments</p>
              <div className="bg-gray-300 px-2 text-sm font-medium text-gray-600">
                {selectedIssue.attachments.length}
              </div>
            </div>
            <div className="flex flex-row items-center gap-1">
              <button
                className="relative cursor-pointer rounded-xs p-1 text-xs text-gray-800 hover:bg-gray-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPlus />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute top-0 right-0"
                  multiple
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </button>
              <button className="cursor-pointer rounded-xs p-1 text-xs text-gray-800 hover:bg-gray-200">
                <BsThreeDots />
              </button>
            </div>
          </div>
          <div className="flex w-full flex-row gap-1 overflow-x-auto">
            {selectedIssue.attachments.map((attachment, index) => (
              <AttachmentCard
                key={index}
                attachment={JSON.parse(attachment)}
                handleDeleteAttachment={handleDeleteAttachment}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Details Section */}
      <Details
        projectId={selectedIssue.project_id}
        selectedIssue={selectedIssue}
        sprints={sprints}
        handleUpdateIssue={handleUpdateIssue}
      />
      {/* Date Section */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Created {formatDate(selectedIssue.created_at)}
          {/* <button className="ml-1 text-gray-500 hover:text-gray-700">
            <FaCog />
          </button> */}
        </p>
        <p className="text-sm text-gray-600">
          Updated {formatDate(selectedIssue.updated_at)}
        </p>
      </div>
      <ActivityIssue issueId={selectedIssue?.id || ""} />
    </div>
  );
};

export default IssueSideBar;
