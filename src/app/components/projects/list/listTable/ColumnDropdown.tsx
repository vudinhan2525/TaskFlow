import { Dropdown, MenuProps } from "antd";
import { useState, useEffect,useRef } from "react";
import React from "react";
const ColumnDropdown = ({
  items,
  currentItem,
  children,
}: {
  items: MenuProps["items"];
  currentItem?: string;
  children: React.ReactNode;
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

  return (
    <div ref={dropdownRef}>
      <Dropdown
        menu={{
          style: {
          marginTop: "8px",
          padding: "4px 0px",
          borderRadius: "0px",
        },
        items: filteredItems,
      }}
      trigger={["click"]}
      onOpenChange={setVisible}
      open={visible}
    >
      {visible ? (
        <input
          placeholder={currentItem}
          value={searchText}
          autoFocus={true}
          style={{
            width:dropdownRef.current?.clientWidth,
          }}
          onChange={(e) => setSearchText(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="rounded-none border-2 border-emerald-500 
          px-2 py-1 text-gray-800 outline-none text-xs"
        />
      ) : (
        <div className="py-2">{children}</div>
        )}
      </Dropdown>
    </div>
  );
};

export default ColumnDropdown;
