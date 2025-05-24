import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, Save, Eye, EyeOff } from "lucide-react";
import { useMe, useChangePassword } from "@libs/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function UserSettingsPage() {
  const { data: meData, isLoading } = useMe();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    old_password: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  useEffect(() => {
    if (meData?.data) {
      setFormData((prev) => ({
        ...prev,
        first_name: meData.data.first_name,
        last_name: meData.data.last_name,
        email: meData.data.email,
        role: meData.data.role,
      }));
    }
  }, [meData]);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.password ||
      formData.old_password ||
      formData.confirm_password
    ) {
      if (!formData.old_password) {
        toast.error("Current password is required");
        return;
      }
      if (!formData.password) {
        toast.error("New password is required");
        return;
      }
      if (formData.password !== formData.confirm_password) {
        toast.error("New passwords do not match");
        return;
      }

      try {
        await changePassword({
          user_id: meData?.data?.id || "",
          old_password: formData.old_password,
          new_password: formData.password,
        });
        toast.success("Password changed successfully!");
        queryClient.invalidateQueries({ queryKey: ["me"] });
        setFormData((prev) => ({
          ...prev,
          old_password: "",
          password: "",
          confirm_password: "",
        }));
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
              "Failed to change password. Please try again.",
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const roles = [
    { value: "User", label: "User" },
    { value: "Admin", label: "Administrator" },
    { value: "Manager", label: "Manager" },
    { value: "Viewer", label: "Viewer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-lg font-bold text-white">
              T
            </div>
            <h1 className="text-2xl font-bold text-slate-800">TaskFlow</h1>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            User Settings
          </h2>
          <p className="text-slate-600">
            Manage your account preferences and profile information
          </p>
        </div>

        {/* Settings Card */}
        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-sm">
          <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-100 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Profile Settings
                </h3>
                <p className="text-slate-600">
                  Update your personal information
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-8">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4" />
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 transition-all duration-200 focus:border-green-400 focus:ring-4 focus:ring-green-50"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 transition-all duration-200 focus:border-green-400 focus:ring-4 focus:ring-green-50"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 transition-all duration-200 focus:border-green-400 focus:ring-4 focus:ring-green-50"
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <h4 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-800">
                Change Password
              </h4>

              {/* Old Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock className="h-4 w-4" />
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 pr-12 transition-all duration-200 focus:border-green-400 focus:ring-4 focus:ring-green-50"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock className="h-4 w-4" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 pr-12 transition-all duration-200 focus:border-green-400 focus:ring-4 focus:ring-green-50"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock className="h-4 w-4" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 pr-12 transition-all duration-200 focus:border-green-400 focus:ring-4 focus:ring-green-50"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Field - Read Only */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Shield className="h-4 w-4" />
                Role
              </label>
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                {roles.find((r) => r.value === formData.role)?.label ||
                  formData.role ||
                  "Unknown"}
              </div>
              <p className="text-xs text-slate-500">
                Contact your administrator to change your role
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={isChangingPassword || isLoading || !meData?.data}
                className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold text-white transition-all duration-200 ${isChangingPassword ? "bg-green-500" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-[0.98]"} ${isChangingPassword ? "cursor-not-allowed opacity-70" : "shadow-lg hover:shadow-xl"}`}
              >
                {isChangingPassword ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()} • Your data is secure
          and encrypted
        </div>
      </div>
    </div>
  );
}
