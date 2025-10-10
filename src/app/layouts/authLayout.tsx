import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuthStore } from "@libs/store/useAuthStore";
import logo from "@libs/assets/taskflow.png";
import Image from "@libs/app/components/general-components/image";
import {
  LuChartColumnIncreasing,
  LuClipboard,
  LuUsersRound,
} from "react-icons/lu";

export default function AuthLayout() {
  const pathname = useLocation().pathname;
  const isLogin = pathname === "/login";

  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gray-50">
      <motion.div
        initial={false}
        animate={{
          x: isLogin ? "0%" : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="absolute inset-y-0 left-0 hidden w-1/2 items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 md:flex"
      >
        <div className="max-w-md px-8">
          <div className="hidden items-center justify-center bg-green-100 md:flex md:w-1/2">
            <div className="max-w-md px-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Image src={logo} className="h-[60px] w-[300px]" />
                <p className="mt-3 text-gray-600">
                  Giải pháp quản lý công việc và dự án hiệu quả cho đội nhóm của
                  bạn
                </p>
              </div>
              <div className="mt-10 space-y-4">
                <div className="flex items-center rounded-lg bg-white p-4 shadow-sm">
                  <div className="mr-4 text-green-500">
                    <LuClipboard className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">Theo dõi công việc</h3>
                    <p className="text-sm text-gray-500">
                      Quản lý tất cả nhiệm vụ và tiến độ
                    </p>
                  </div>
                </div>
                <div className="flex items-center rounded-lg bg-white p-4 shadow-sm">
                  <div className="mr-4 text-green-500">
                    <LuUsersRound className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">Làm việc nhóm hiệu quả</h3>
                    <p className="text-sm text-gray-500">
                      Tối ưu quy trình làm việc của đội nhóm
                    </p>
                  </div>
                </div>
                <div className="flex items-center rounded-lg bg-white p-4 shadow-sm">
                  <div className="mr-4 text-green-500">
                    <LuChartColumnIncreasing className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">Báo cáo chi tiết</h3>
                    <p className="text-sm text-gray-500">
                      Theo dõi tiến độ với báo cáo trực quan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          x: isLogin ? "100%" : "0%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="absolute inset-y-0 left-0 flex w-full items-center justify-center md:w-1/2"
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex w-full items-center justify-center"
        >
          <Outlet />
        </motion.div>
      </motion.div>
    </div>
  );
}
