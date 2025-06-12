import { useEffect, useRef, useState } from "react";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { uploadFileToCloudinary } from "@libs/utils/uploadFileToCloud";
import { useUpdateIssue } from "@libs/hooks/useIssue";

export default function TextEditor({
  initialDeltaString,
  issueId,
  projectId,
  attachments,
  handleSave,
  handleCancel,
}: {
  initialDeltaString: string;
  issueId: string;
  projectId: string;
  attachments: string[];
  handleSave: (newValue: string) => void;
  handleCancel: () => void;
}) {
  const editorRef = useRef(null);
  const quillRef = useRef<Quill | null>(null);
  const [initialAttachmentsOps, setInitialAttachmentsOps] = useState<string[]>([])
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  useEffect(() => {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike", "link", "image", "video", { list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["clean"],
    ];

    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });

      try {
        if (initialDeltaString) {
          const delta = JSON.parse(initialDeltaString).delta;
          quillRef.current.setContents(delta);

          const imageOps = delta.ops
            .filter((op) => op.insert.image)
            .map((op) => op.insert.image);
          setInitialAttachmentsOps(imageOps);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [initialDeltaString]);

  const handleSaveDescription = async () => {
    if (!quillRef.current) return;

    const rawDelta: Delta = quillRef.current.getContents();
    const delta = await handleProcessDelta(rawDelta);

    const plainText = quillRef.current.getText();

    const description = {
      plainText,
      delta,
    };
    handleSave(JSON.stringify(description));
  };

  const handleProcessDelta = async (rawDelta: Delta): Promise<Delta> => {
    // Extract current image operations
    const currentImageOps = rawDelta.ops
      .filter((op) => typeof op.insert === "object" && "image" in op.insert)
      .map((op) => op.insert.image);

    // Identify deleted images by comparing initial and current image operations
    const deletedImages = initialAttachmentsOps.filter(
      (image) => !currentImageOps.includes(image)
    );

    // Filter out deleted attachments
    let updatedAttachments = [...attachments];
    if (deletedImages.length > 0) {
      updatedAttachments = attachments.filter((attachment) => {
        const { url } = JSON.parse(attachment);
        return !deletedImages.includes(url);
      });

      // Update the issue with the new attachments list
      await updateIssueAsync({
        id: issueId,
        data: {
          attachments: updatedAttachments,
        },
      });
    }

    // Handle new images
    const newAttachments = [];
    for (const op of rawDelta.ops) {
      if (typeof op.insert === "object" && "image" in op.insert) {
        const image = op.insert as { image: string };
        if (!initialAttachmentsOps.includes(image.image)) {
          // Upload new image to Cloudinary
          const imageUrl = await uploadFileToCloudinary(image.image, undefined);
          op.insert = { image: imageUrl };
          newAttachments.push(
            JSON.stringify({
              url: imageUrl,
              type: "image",
              created_at: new Date().toISOString(),
            })
          );
        }
      }
    }

    // Update attachments with new images
    if (newAttachments.length > 0) {
      updatedAttachments = [...updatedAttachments, ...newAttachments];
      console.log(newAttachments)
      await updateIssueAsync({
        id: issueId,
        data: {
          attachments: updatedAttachments,
        },
      });
    }

    return rawDelta;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div ref={editorRef} />
      <div className="flex flex-row gap-2">
        <button
          onClick={handleSaveDescription}
          className="cursor-pointer rounded-sm bg-emerald-500 px-[10px] py-1 text-sm font-medium text-white"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="cursor-pointer rounded-sm bg-transparent px-[10px] py-1 text-sm font-medium text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}