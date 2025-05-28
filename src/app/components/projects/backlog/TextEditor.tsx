import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function TextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef(null);
  const quillInstance = useRef<Quill | null>(null);
  function formatDelta(delta) {
    return `<${JSON.stringify(delta.ops, null, 2)}`;
  }

  function update(delta) {
    console.log(formatDelta(delta));
  }
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        debug: false,
        modules: {
          toolbar: true,
        },
        placeholder: "Compose an epic...",
        theme: "snow",
      });
      quillInstance.current?.on(Quill.events.TEXT_CHANGE, update);
    }
  }, []);

  useEffect(() => {
    if (quillInstance.current) {
      quillInstance.current.insertText(0, value);
    }
  }, [value]);

  return <div className="w-full" ref={editorRef}></div>;
}
