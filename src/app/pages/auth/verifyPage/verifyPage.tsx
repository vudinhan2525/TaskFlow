import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import Branding from "@libs/app/pages/auth/registerPage/branding";
import Image from "@libs/app/components/general-components/image";
import logo from "@libs/assets/taskflow.png";
import { Link, useLocation } from "react-router-dom";
import Button from "@libs/app/components/general-components/button";
import { useAuth } from "@libs/hooks/apis/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { setError } from "@libs/store/slices/authSlice";

const VerifyPage: React.FC = () => {
  const [otpValue, setOtpValue] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const location = useLocation();
  const { email } = location.state || {};

  const { verifyOtp, resendOtp } = useAuth();
  const isLoading = verifyOtp.isPending;
  const isResending = resendOtp.isPending;
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    dispatch(setError(null));
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      message.error("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    dispatch(setError(null));
    verifyOtp.mutate({ otp: otpValue, email });
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      await resendOtp.mutateAsync({ email });
      setCountdown(60);
      setCanResend(false);
      setOtpValue("");
      message.success("OTP đã được gửi lại!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Không thể gửi lại OTP. Vui lòng thử lại!");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
              Xác nhận mã OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Chúng tôi đã gửi mã xác nhận 6 số đến email của bạn.
              <br />
              Vui lòng nhập mã để hoàn tất đăng ký.
            </p>
          </div>

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

          <div className="mt-8 space-y-6">
            {/* OTP Input */}
            <div className="flex flex-col items-center space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Nhập mã OTP
              </label>
              <Input.OTP
                length={6}
                value={otpValue}
                onChange={handleOtpChange}
                size="large"
                className="otp-input"
              />
            </div>

            {/* Verify Button */}
            <div>
              <Button
                variant="primary"
                isLoading={isLoading}
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={otpValue.length !== 6}
              >
                Xác nhận
              </Button>
            </div>

            {/* Resend OTP Section */}
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-600">Không nhận được mã?</p>

              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm font-medium text-green-600 hover:text-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResending ? "Đang gửi..." : "Gửi lại mã OTP"}
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Gửi lại sau:{" "}
                  <span className="font-mono text-green-600">
                    {formatTime(countdown)}
                  </span>
                </p>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                ← Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <Branding />
    </div>
  );
};

export default VerifyPage;
