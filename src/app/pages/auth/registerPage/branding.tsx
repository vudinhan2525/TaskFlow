import Image from "@libs/app/components/general-components/image";
import logo from "@libs/assets/taskflow.png";

export default function Branding() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-green-100 justify-center items-center">
      <div className="max-w-md px-8">
        <div className="text-center flex items-center justify-center flex-col">
          <Image src={logo} className="w-[300px] h-[60px]" />
          <p className="mt-3 text-gray-600">
            Tham gia cùng hàng nghìn đội nhóm đang sử dụng TaskFlow để quản lý công việc hiệu quả
          </p>
        </div>
        <div className="mt-10 space-y-4">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="mr-4 text-green-500">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Tạo dự án dễ dàng</h3>
              <p className="text-sm text-gray-500">Thiết lập dự án mới chỉ trong vài phút</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="mr-4 text-green-500">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Tiết kiệm thời gian</h3>
              <p className="text-sm text-gray-500">Theo dõi và quản lý công việc hiệu quả</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="mr-4 text-green-500">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Hợp tác hiệu quả</h3>
              <p className="text-sm text-gray-500">Kết nối và làm việc cùng đội nhóm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
