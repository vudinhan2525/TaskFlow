
const RenderTextCell = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className="">
      <div className="flex cursor-pointer justify-start rounded-sm border-1 border-gray-200 px-1 py-0.5">
        <p className={`text-sm font-normal text-gray-800 ${className}`}>
          {text}
        </p>
      </div>
    </div>
  );
};

export default RenderTextCell;
