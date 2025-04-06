import React from "react";
import logo from "@libs/assets/taskflow.png";
import Image from "@libs/app/components/general-components/image";
import { LuLock } from "react-icons/lu";
import Branding from "@libs/app/pages/auth/loginPage/branding";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OrthersLogin from "@libs/app/components/general-components/orthersLogin";
import { Link } from "react-router-dom";

// Schema definition with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Login successful", data);
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Branding */}
      <Branding />

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to={"/"} className="flex cursor-pointer justify-center">
              <Image src={logo} className="w-[200px] h-[40px]" />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng nhập vào TaskFlow</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hoặc{" "}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                đăng ký ngay nếu bạn chưa có tài khoản
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md flex flex-col gap-2">
              <div>
                <input
                  {...register("email")}
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 shadow-md text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Mật khẩu"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 shadow-md text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register("rememberMe")}
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isSubmitting ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LuLock
                    className={`h-5 w-5 text-green-500 ${
                      isSubmitting ? "text-green-300" : "text-green-400 group-hover:text-green-300"
                    }`}
                  />
                </span>
                {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </div>
          </form>

          <OrthersLogin />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
