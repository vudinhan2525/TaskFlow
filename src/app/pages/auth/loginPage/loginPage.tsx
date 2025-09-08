import React from "react";
import logo from "@libs/assets/taskflow.png";
import Image from "@libs/app/components/general-components/image";
import Branding from "@libs/app/pages/auth/loginPage/branding";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OrthersLogin from "@libs/app/components/general-components/orthersLogin";
import { Link } from "react-router-dom";
import { useAuth } from "@libs/hooks/useAuth";

import Button from "@libs/app/components/general-components/button";
// Schema definition with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const isLoading = login.isPending;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    login.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Branding */}
      <Branding />

      {/* Right side - Login form */}
      <div className="flex w-full items-center justify-center px-4 sm:px-6 md:w-1/2 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to={"/"} className="cursor-pointer">
                <Image src={logo} className="h-[40px] w-[200px]" />
              </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Đăng nhập vào TaskFlow
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hoặc{" "}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-500"
              >
                đăng ký ngay nếu bạn chưa có tài khoản
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2 rounded-md">
              <div>
                <input
                  {...register("email")}
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  onChange={() => {
                    // setValue("email", "");
                  }}
                  placeholder="Email"
                  className={`relative block w-full appearance-none border px-3 py-2 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md text-gray-900 placeholder-gray-500 shadow-md focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => {
                    setValue("password", e.target.value);
                  }}
                  placeholder="Mật khẩu"
                  className={`relative block w-full appearance-none border px-3 py-2 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md text-gray-900 placeholder-gray-500 shadow-md focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register("rememberMe")}
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <Button
                variant="primary"
                isLoading={isLoading}
                type="submit"
                className="w-full"
              >
                Đăng nhập
              </Button>
            </div>
          </form>

          <OrthersLogin />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
