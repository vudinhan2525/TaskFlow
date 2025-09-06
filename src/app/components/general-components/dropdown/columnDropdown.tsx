import { Dropdown, type MenuProps } from "antd";
import { useState, useEffect, useRef, memo } from "react";
import React from "react";
const ColumnDropdown = memo(
  ({
    items,
    currentItem,
    children,
    setIsOpenDropdown,
  }: {
    items: MenuProps["items"];
    currentItem?: string;
    children: React.ReactNode;
    setIsOpenDropdown?: (isFetch: boolean) => void;
  }) => {
    const [searchText, setSearchText] = useState("");
    const [visible, setVisible] = useState(false);
    const [filteredItems, setFilteredItems] = useState(items);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (searchText.length == 0) {
        setFilteredItems(items);
        return;
      }
      const filteredItems = items?.filter((item) => {
        if (
          !item ||
          typeof item !== "object" ||
          !("value" in item) ||
          typeof item.value !== "string"
        ) {
          return false;
        }
        return item.value.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredItems(filteredItems);
    }, [searchText, items]);
    const [elementHeight, setElementHeight] = useState(0);
    useEffect(() => {
      const container = document.getElementsByClassName("ant-table-cell");
      if (container.length > 0) {
        setElementHeight(container[0].clientHeight);
      }
    }, []);

    return (
      <div
        style={{
          blockSize: elementHeight,
        }}
        className="flex items-center"
        ref={dropdownRef}
      >
        <Dropdown
          menu={{
            style: {
              padding: "4px 0px",
              borderRadius: "0px",
            },
            items: filteredItems,
          }}
          trigger={["click"]}
          onOpenChange={(open) => {
            setVisible(open);
            if (setIsOpenDropdown) setIsOpenDropdown(open);
          }}
          open={visible}
        >
          {visible ? (
            <div className="p-1">
              <input
                placeholder={currentItem}
                value={searchText}
                autoFocus={true}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="h-full w-full rounded-none border-2 border-emerald-500 p-1 text-xs text-gray-800 outline-none"
              />
            </div>
          ) : (
            <div className="py-2">{children}</div>
          )}
        </Dropdown>
      </div>
    );
  },
);

export default ColumnDropdown;
