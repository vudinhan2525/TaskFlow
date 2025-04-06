import { FaCheck } from "react-icons/fa6";
import { Popover } from "antd";
import { ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
interface Option {
  label: string;
  value: string;
  icon?: ReactNode;
}
interface DropDownProps {
  options: Option[];
  parent: ReactNode;
  onClickItem?: (option: Option) => void;
  menuClassName?: string;
  rowClassName?: string;
  value?: Option;
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
}
export default function DropdownAntd({
  options,
  parent,
  onClickItem,
  value,
  menuClassName,
  rowClassName,
  placement = "bottomRight",
}: DropDownProps) {
  const [open, setOpen] = useState(false);
  const dropDownOpt = () => {
    return (
      <div className={` ${menuClassName}`}>
        {options.map((option, idx) => (
          <div
            onClick={() => {
              setOpen(false);
              if (onClickItem) onClickItem(option);
            }}
            key={idx}
            className={`px-2 py-1 rounded-md flex gap-2 items-center  cursor-pointer hover:bg-gray-200 transition-all ${rowClassName}`}
          >
            {option?.icon && <div className="min-w-[20px] flex items-center justify-center">{option.icon}</div>}
            {value && value.value === option.value && <FaCheck className="w-5 h-5" />}
            <div className="">{option.label}</div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="dropdown-ct">
      <Popover
        content={() => dropDownOpt()}
        trigger="click"
        arrow={false}
        placement={placement}
        open={open}
        onOpenChange={(bool) => setOpen(bool)}
      >
        <div className="border-[1px] flex items-center justify-between gap-2 border-gray-300 px-3 py-[6px] rounded-md cursor-pointer">
          <p className="text-gray-700 font-semibold">{parent}</p>
          <FaChevronDown className="text-gray-500" />
        </div>
      </Popover>
    </div>
  );
}
