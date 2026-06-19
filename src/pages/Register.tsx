/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Register.css";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useSignupMutation } from "../Redux/features/auth/authApi";
import { setAccessToken } from "../Redux/features/auth/authSlice";
import { useAppDispatch } from "../Redux/hooks";

interface RegisterInfo {
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  ebayStoreName: string;
  numberOfLiveItems: string;
  discountCode: string;
}

const features = ["End-to-end encryption", "99.9% uptime", "Real-time mapping"];

const Register = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signUp, { isLoading }] = useSignupMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    ebayStoreName: "",
    numberOfLiveItems: "",
    discountCode: "",
  });

  const handleChange =
    (field: keyof RegisterInfo) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setRegisterInfo((prev) => ({ ...prev, [field]: e.target.value }));

  // Pick up discount code from URL (?code=...)
  useEffect(() => {
    const codeFromURL = new URLSearchParams(location.search).get("code");
    if (codeFromURL) {
      setRegisterInfo((prev) => ({
        ...prev,
        discountCode: codeFromURL.toUpperCase(),
      }));
    }
  }, [location.search]);

  const handleSellerInfo = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://api.help-on-time.com/api/datacube/public/ebayauth",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        window.open(response.data, "_blank");
      }
    } catch (error) {
      console.error("Error fetching eBay auth URL:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerInfo.password !== registerInfo.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const data = {
      fullName: registerInfo.fullName,
      email: registerInfo.email,
      phoneNumber: registerInfo.phoneNumber,
      companyName: registerInfo.companyName,
      ebayStoreName: registerInfo.ebayStoreName,
      numberOfLiveItems: registerInfo.numberOfLiveItems,
      password: registerInfo.password,
      discountCode: registerInfo.discountCode,
      role: ["user"],
    };

    try {
      const result = await signUp(data).unwrap();
      dispatch(setAccessToken(result));
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("userName", registerInfo.fullName);
      localStorage.setItem("isNewUser", "true");
      toast.success("User registration successful");
      handleSellerInfo();
      window.open("/dashboard", "_blank");
    } catch (error: any) {
      console.error("Error details:", error);
      toast.error(
        error?.data?.message || "An error occurred while registering."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/15";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[#334155]";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F4F7FF] via-[#F7F9FE] to-[#E9F0FE] font-poppins">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center gap-12 px-6 py-10 lg:flex-row lg:gap-16 lg:px-10">
        {/* Left: marketing */}
        <div className="w-full max-w-[560px]">
          <h2 className="mb-10 text-xl font-bold text-[#1D4ED8]">eBay2Temu</h2>

          <h1 className="text-[44px] font-extrabold leading-[1.1] tracking-tight text-[#0F172A] sm:text-[52px]">
            Migrate Your eBay Listings to TEMU in Minutes
          </h1>

          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-[#475569]">
            Join thousands of high-volume sellers expanding their reach. Our
            secure, API-driven platform ensures your data transfers with
            absolute precision.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1D4ED8]" />
                <span className="text-[15px] text-[#334155]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <div className="w-full max-w-[520px] rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] sm:p-10">
          <h2 className="text-[30px] font-bold text-[#0F172A]">
            Create your account
          </h2>
          <p className="mt-1.5 text-[15px] text-[#64748B]">
            Start your seamless migration.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={registerInfo.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Jane Doe"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  value={registerInfo.companyName}
                  onChange={handleChange("companyName")}
                  placeholder="Acme Corp"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Work Email</label>
              <input
                type="email"
                value={registerInfo.email}
                onChange={handleChange("email")}
                placeholder="jane@acmecorp.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number (Optional)</label>
              <input
                type="tel"
                value={registerInfo.phoneNumber}
                onChange={handleChange("phoneNumber")}
                placeholder="+44 7700 900000"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerInfo.password}
                    onChange={handleChange("password")}
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
                <label className={labelClass}>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerInfo.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="••••••••"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Get Started"}
            </button>
          </form>

          <p className="mt-6 text-center text-[15px] text-[#64748B]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#1D4ED8] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
