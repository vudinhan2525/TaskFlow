import { Dropdown, MenuProps, Space } from "antd";
import { useState, useEffect } from "react";
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
  
  useEffect(() => {
    if (searchText.length == 0){
      setFilteredItems(items)
      return  
    }
    const filteredItems = items?.filter((item) => {
      if (!item || typeof item !== 'object' || !('value' in item) || typeof item.value !== 'string') {
        return false;
      }
      return item.value.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredItems(filteredItems);
  }, [searchText, items]);

  return (
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
      <a onClick={(e) => e.preventDefault()}>
        <Space className="w-full">
          {visible ? (
            <input
              placeholder={currentItem}
              value={searchText}
              autoFocus={true}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="rounded-none border-2 border-emerald-500 p-2 text-gray-800 outline-none"
              style={{ width: "100%" }}
            />
          ) : (
            children
          )}
        </Space>
      </a>
    </Dropdown>
  );
};

export default ColumnDropdown;
