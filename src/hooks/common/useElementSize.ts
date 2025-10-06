import { useEffect, useState } from "react";

export const useElementSize = (
  ref: React.RefObject<HTMLElement | null>,
  selectedIssue: any,
) => {
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");
  useEffect(() => {
    if (!ref?.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;

      if (width > 600) {
        setLayout("horizontal");
      } else {
        setLayout("vertical");
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, selectedIssue]);

  return layout;
};
