import { useEffect, useRef } from "react";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { uploadFileToCloudinary } from "@libs/utils/uploadFileToCloud";

export default function TextEditor({
  initialValue,
  handleSave,
  handleCancel,
}: {
  initialValue: string;
  handleSave: (newValue: string) => void;
  handleCancel: () => void;
}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const toolbarOptions = [
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "link",
      "image",
      "video",
      { list: "ordered" },
      { list: "bullet" },
    ],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["clean"],
  ];

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });
      try {
        if (initialValue) {
          quillRef.current.setContents(JSON.parse(initialValue).delta);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const handleSaveDescription = async () => {
    const rawDelta: Delta = quillRef.current?.getContents();
    const delta = await handleProcessDelta(rawDelta);

    const plainText = quillRef.current?.getText();

    const description = {
      plainText,
      delta,
    };
    handleSave(JSON.stringify(description));
  };
  const handleProcessDelta = async (
    rawDelta: Delta,
  ): Promise<Delta> => {
    const mediaOps = rawDelta.ops.filter(
      (op) => typeof op.insert === "object" && 
        'image' in op.insert && 
        typeof op.insert.image === 'string' && 
        op.insert.image.includes("data")
    );

    for (const op of mediaOps) {
      if (!op.attributes) {
        const image = op.insert as {
          image: string;
        };
        const imageUrl = await uploadFileToCloudinary(image.image,undefined);
        op.insert = {
          image: imageUrl,
        };
      }
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
