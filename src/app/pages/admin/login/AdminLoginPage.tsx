import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminAuth } from "@libs/hooks/common/useAdminAuth";
import { isAxiosError } from "axios";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

const AdminLoginPage = () => {
  const { login } = useAdminAuth();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      await login.mutateAsync(data);
    } catch (err) {
      const errorMessage = isAxiosError(err)
        ? err.response?.data?.message || "Login failed"
        : err instanceof Error
          ? err.message
          : "Invalid credentials or insufficient permissions";

      setFormError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const isLoading = login.status === "pending";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            TaskFlow Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                className="relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {errors.root && (
            <p className="text-center text-sm text-red-600">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
