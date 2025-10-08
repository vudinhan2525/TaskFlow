import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Branding from "@libs/app/pages/auth/registerPage/branding";
import Image from "@libs/app/components/general-components/image";
import logo from "@libs/assets/taskflow.png";
import OrthersLogin from "@libs/app/components/general-components/orthersLogin";
import { Link } from "react-router-dom";
import Button from "@libs/app/components/general-components/button";
import { useAuth } from "@libs/hooks/apis/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { setError } from "@libs/store/slices/authSlice";

// Định nghĩa schema validation với Zod
const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
      .max(50, { message: "Tên không được quá 50 ký tự" }),
    last_name: z
      .string()
      .min(2, { message: "Họ phải có ít nhất 2 ký tự" })
      .max(50, { message: "Họ không được quá 50 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ hoa" })
      .regex(/[a-z]/, { message: "Mật khẩu phải có ít nhất 1 chữ thường" })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 số" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      }),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirm"],
  });

// Kiểu dữ liệu từ schema
type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerMut } = useAuth();
  const isLoading = registerMut.isPending;
  const isSuccess = registerMut.isSuccess;
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(setError(null));
    registerMut.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Form */}
      <div className="flex w-full items-center justify-center px-4 sm:px-6 md:w-1/2 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to={"/"} className="cursor-pointer">
                <Image src={logo} className="h-[40px] w-[200px]" />
              </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Đăng ký tài khoản TaskFlow
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hoặc{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                đăng nhập ngay nếu bạn đã có tài khoản
              </Link>
            </p>
          </div>

          {isSuccess && (
            <div className="border-l-4 border-green-400 bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài
                    khoản.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="border-l-4 border-red-400 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="-space-y-px rounded-md">
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Tên
                  </label>
                  <input
                    id="first_name"
                    {...register("first_name")}
                    type="text"
                    autoComplete="given-name"
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 ${
                      errors.first_name ? "border-red-300" : "border-gray-300"
                    } text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                    placeholder="Tên"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Họ
                  </label>
                  <input
                    id="last_name"
                    {...register("last_name")}
                    type="text"
                    autoComplete="family-name"
                    className={`relative block w-full appearance-none rounded-md border px-3 py-2 ${
                      errors.last_name ? "border-red-300" : "border-gray-300"
                    } text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                    placeholder="Họ"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={`relative block w-full appearance-none rounded-md border px-3 py-2 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  {...register("password")}
                  type="password"
                  autoComplete="new-password"
                  className={`relative block w-full appearance-none rounded-md border px-3 py-2 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                  placeholder="Mật khẩu"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password_confirm"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  id="password_confirm"
                  {...register("password_confirm")}
                  type="password"
                  autoComplete="new-password"
                  className={`relative block w-full appearance-none rounded-md border px-3 py-2 ${
                    errors.password_confirm
                      ? "border-red-300"
                      : "border-gray-300"
                  } text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                  placeholder="Xác nhận mật khẩu"
                />
                {errors.password_confirm && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password_confirm.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button
                variant="primary"
                isLoading={isLoading}
                type="submit"
                className="w-full"
              >
                Đăng ký
              </Button>
            </div>
          </form>

          <OrthersLogin />
        </div>
      </div>

      {/* Right side - Branding */}
      <Branding />
    </div>
  );
};

export default RegisterPage;
