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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { setError } from "@libs/store/slices/authSlice";
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
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);
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
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to={"/"} className="cursor-pointer">
                <Image src={logo} className="w-[200px] h-[40px]" />
              </Link>
            </div>
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
                  onChange={() => dispatch(setError(null))}
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
                  onChange={(e) => {
                    setValue("password", e.target.value);
                    dispatch(setError(null));
                  }}
                  placeholder="Mật khẩu"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 shadow-md text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
              <Button variant="primary" isLoading={isLoading} type="submit" className="w-full">
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
