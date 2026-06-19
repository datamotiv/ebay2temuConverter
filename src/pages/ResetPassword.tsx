/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { useResetPasswordTemuMutation } from "../Redux/features/auth/temuAuthApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordTemuMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  // Redirect to login shortly after a successful reset.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => navigate("/login"), 4000);
    return () => clearTimeout(timer);
  }, [done, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      setDone(true);
      toast.success("Password reset successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired reset link.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/15";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[#334155]";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F4F7FF] via-[#F7F9FE] to-[#E9F0FE] px-6 font-poppins">
      <div className="w-full max-w-[460px] rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] sm:p-10">
        <h2 className="mb-8 text-center text-xl font-bold text-[#1D4ED8]">
          eBay2Temu
        </h2>

        {!token ? (
          <div className="text-center">
            <XCircle className="mx-auto h-14 w-14 text-[#DC2626]" />
            <h1 className="mt-6 text-[24px] font-bold text-[#0F172A]">
              Invalid reset link
            </h1>
            <p className="mt-2 text-[15px] text-[#64748B]">
              This password reset link is missing its token. Request a new one
              from the login page.
            </p>
            <Link
              to="/login"
              className="mt-7 inline-block w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
            >
              Back to Login
            </Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#16A34A]" />
            <h1 className="mt-6 text-[24px] font-bold text-[#0F172A]">
              Password updated
            </h1>
            <p className="mt-2 text-[15px] text-[#64748B]">
              Your password has been reset. Redirecting you to login…
            </p>
            <Link
              to="/login"
              className="mt-7 inline-block w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
            >
              Continue to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-[26px] font-bold text-[#0F172A]">
              Set a new password
            </h1>
            <p className="mt-1.5 text-[15px] text-[#64748B]">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition hover:text-[#475569]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Updating…" : "Reset Password"}
              </button>
            </form>

            <p className="mt-6 text-center text-[15px] text-[#64748B]">
              Remembered it?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#1D4ED8] hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
