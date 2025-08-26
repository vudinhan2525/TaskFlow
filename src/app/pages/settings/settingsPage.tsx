import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Save,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Palette,
  Globe,
  Camera,
} from "lucide-react";
import { useMe } from "@libs/hooks/useUser";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import UpdateAvatarModal from "@libs/app/components/projects/modals/updateAvatarModal";
import ImageCropProvider from "@libs/app/components/cropper/imageCropProvider";
export default function UserSettingsPage() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { data } = useMe();
  const user = data?.data;
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    old_password: "",
    password: "",
    confirm_password: "",
    role: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        old_password: "",
        password: "",
        confirm_password: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPassword(true);

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        old_password: "",
        password: "",
        confirm_password: "",
      }));
    }, 2000);
  };

  const sidebarItems = [
    { id: "profile", label: "Hồ sơ cá nhân", icon: User },
    { id: "account", label: "Tài khoản", icon: Settings },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "preferences", label: "Tùy chọn", icon: Palette },
    { id: "language", label: "Ngôn ngữ", icon: Globe },
  ];
  if (!user) return null;

  const renderProfileContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          Hồ sơ cá nhân
        </h2>
        <p className="text-gray-600">Quản lý thông tin hồ sơ của bạn</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center space-x-3">
          <div className="group relative cursor-pointer">
            <UserAvatar userId={user.id} isDisplayName={false} size={72} />
            <div
              onClick={() => {
                setIsOpenModal(true);
              }}
              className="absolute inset-0 hidden rounded-full opacity-60 group-hover:block group-hover:cursor-pointer"
            >
              <div className="flex h-full w-full items-center justify-center">
                <Camera />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {formData.first_name} {formData.last_name}
            </h3>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Họ
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Địa chỉ email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Thay đổi mật khẩu
        </h3>

        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChangingPassword ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Cập nhật mật khẩu
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Vai trò</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{formData.role}</p>
            <p className="text-sm text-gray-500">
              Liên hệ quản trị viên để thay đổi vai trò của bạn
            </p>
          </div>
          <Shield className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "account":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Cài đặt tài khoản
              </h2>
              <p className="text-gray-600">Quản lý cài đặt tài khoản của bạn</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-gray-500">
                Nội dung cài đặt tài khoản sẽ được thêm vào đây.
              </p>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Bảo mật
              </h2>
              <p className="text-gray-600">Quản lý cài đặt bảo mật của bạn</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-gray-500">
                Nội dung bảo mật sẽ được thêm vào đây.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Đang phát triển
              </h2>
              <p className="text-gray-600">
                Tính năng này đang được phát triển
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-gray-500">Nội dung sẽ được thêm vào đây.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ImageCropProvider
      max_zoom={6}
      min_zoom={1}
      zoom_step={0.1}
      max_rotation={180}
      min_rotation={-180}
      rotation_step={1}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="p-6">
                  <div className="mb-6 flex items-center space-x-3">
                    <div className="group relative cursor-pointer">
                      <UserAvatar
                        userId={user.id}
                        isDisplayName={false}
                        size={48}
                      />
                      <div
                        onClick={() => {
                          setIsOpenModal(true);
                        }}
                        className="absolute inset-0 hidden rounded-full opacity-60 group-hover:block group-hover:cursor-pointer"
                      >
                        <div className="flex h-full w-full items-center justify-center">
                          <Camera />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {formData.first_name} {formData.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quản lý tài khoản của bạn
                      </p>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            activeTab === item.id
                              ? "border-r-2 border-blue-700 bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <Icon className="mr-3 h-5 w-5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Chức danh của bạn</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Phòng ban của bạn</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tổ chức của bạn</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="text-xs text-gray-500">
                    <div className="mb-2">
                      <strong>Liên hệ</strong>
                    </div>
                    <div>{formData.email}</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="text-xs text-gray-500">
                    <div className="mb-2">
                      <strong>Nhóm</strong>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      + Tạo nhóm
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">{renderContent()}</div>
          </div>
        </div>

        <UpdateAvatarModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          user={user}
        />
      </div>
    </ImageCropProvider>
  );
}
