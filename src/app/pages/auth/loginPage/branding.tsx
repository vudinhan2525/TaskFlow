import logo from "@libs/assets/taskflow.png";
import Image from "@libs/app/components/general-components/image";
import { LuChartColumnIncreasing, LuClipboard, LuUsersRound } from "react-icons/lu";

export default function Branding() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-green-100 justify-center items-center">
      <div className="max-w-md px-8">
        <div className="text-center flex flex-col items-center justify-center">
          <Image src={logo} className="w-[300px] h-[60px]" />
          <p className="mt-3 text-gray-600">Giải pháp quản lý công việc và dự án hiệu quả cho đội nhóm của bạn</p>
        </div>
        <div className="mt-10 space-y-4">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="mr-4 text-green-500">
              <LuClipboard className="text-2xl" />
            </div>
            <div>
              <h3 className="font-medium">Theo dõi công việc</h3>
              <p className="text-sm text-gray-500">Quản lý tất cả nhiệm vụ và tiến độ</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="mr-4 text-green-500">
              <LuUsersRound className="text-2xl" />
            </div>
            <div>
              <h3 className="font-medium">Làm việc nhóm hiệu quả</h3>
              <p className="text-sm text-gray-500">Tối ưu quy trình làm việc của đội nhóm</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="mr-4 text-green-500">
              <LuChartColumnIncreasing className="text-2xl" />
            </div>
            <div>
              <h3 className="font-medium">Báo cáo chi tiết</h3>
              <p className="text-sm text-gray-500">Theo dõi tiến độ với báo cáo trực quan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
