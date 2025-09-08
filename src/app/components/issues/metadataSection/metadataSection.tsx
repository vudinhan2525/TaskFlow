import React, { lazy, useState, useTransition } from "react";
import { IIssue } from "@libs/types/issue";
import { FaPlus } from "react-icons/fa";
// import { TbHexagon3D } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { uploadFileToCloudinary } from "@libs/utils/uploadFileToCloud";

const AttachmentCard = lazy(
  () => import("./attachmentCard"),
);
const TextEditor = lazy(() => import("./textEditor"));
const MetadataSection = ({
  selectedIssue,
  fileInputRef,
  handleUpdateIssue,
}: {
  selectedIssue: IIssue;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUpdateIssue: (key: string, value: string) => void;
}) => {
  const [summary, setSummary] = useState(selectedIssue?.summary || "");
  const [, startTransition] = useTransition();
  const [isShowingTextEditor, setIsShowingTextEditor] = useState(false);
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });

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
        id: selectedIssue!.id,
        data: {
          attachments: [
            ...selectedIssue!.attachments,
            JSON.stringify(newAttachment),
          ],
        },
      });
    }
  };
  const handleDeleteAttachment = async (attachment: string) => {
    await updateIssueAsync({
      id: selectedIssue!.id,
      data: {
        attachments: selectedIssue!.attachments.filter(
          (a) => JSON.parse(a).url !== attachment,
        ),
      },
    });
  };
  return (
    <div className="flex w-full flex-1 flex-col gap-2">
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
          className="w-full cursor-pointer rounded border-2 border-transparent bg-transparent p-2 text-sm font-semibold text-gray-500 outline-none hover:bg-gray-200 focus:border-emerald-500"
        />
      </div>
      {/* <div className="flex flex-row gap-2">
        <button className="flex cursor-pointer items-center gap-2 rounded-sm border-1 border-gray-300 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200">
          <FaPlus />
          <span className="text-sm font-medium text-gray-800">Add</span>
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded-sm border-1 border-gray-300 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200">
          <TbHexagon3D />
          <span className="text-sm font-medium text-gray-800">Apps</span>
        </button>
      </div> */}
      {/* Description */}
      <div className="flex w-full flex-col items-start gap-1">
        <p className="py-1 text-sm font-bold text-gray-600">Description</p>

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
            onChange={() => {}}
            value={
              selectedIssue?.description &&
              selectedIssue!.description[0] === "{"
                ? JSON.parse(selectedIssue?.description || "{}")?.plainText
                : selectedIssue?.description
            }
            onClick={() => {
              startTransition(() => {
                setIsShowingTextEditor(true);
              });
            }}
            placeholder="Add a description"
            className="w-full rounded border border-gray-300 p-2 text-sm outline-none hover:bg-gray-100 focus:border-emerald-500"
          />
        )}
      </div>

      {/* Attachments */}
      {selectedIssue!.attachments.length ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-1">
              <p className="text-sm font-bold text-gray-600">Attachments</p>
              <div className="bg-gray-300 px-2 text-sm font-medium text-gray-600">
                {selectedIssue!.attachments.length}
              </div>
            </div>
            <div className="flex flex-row items-center gap-1">
              <button
                className="relative cursor-pointer rounded-xs p-1 text-xs text-gray-800 hover:bg-gray-200"
                onClick={() => fileInputRef?.current?.click()}
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
            {selectedIssue!.attachments.map((attachment, index) => (
              <AttachmentCard
                key={index}
                attachment={JSON.parse(attachment)}
                handleDeleteAttachment={handleDeleteAttachment}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default MetadataSection;


