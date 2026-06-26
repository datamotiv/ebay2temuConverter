/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useSigninTemuMutation } from "../Redux/features/auth/temuAuthApi";
import { setAccessToken } from "../Redux/features/auth/authSlice";
import { useAppDispatch } from "../Redux/hooks";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface Seller {
  userId: number;
  sellerName: string;
  email: string;
}

const features = ["End-to-end encryption", "99.9% uptime", "Real-time mapping"];

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSigninTemuMutation();
  const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
  const [sellerList] = useState<Seller[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [loginResult, setLoginResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    const { username, password } = loginInfo;
    // if (!username) return toast.error("Email can't be empty.");
    // if (!password) return toast.error("Password can't be empty.");

    try {
      const result = await signIn({ email: username, password }).unwrap();
      setLoginResult(result);

      // if (result.admin && !username.includes("/")) {
      //   const sellers = await fetchSellers(result.accessToken);
      //   if (sellers.length > 0) {
      //     setSellerList(sellers);
      //     setSellerDialogOpen(true);
      //   }
      //   localStorage.setItem("isAdmin", String(result.admin));
      // } else {
      //   handlePostLogin(username, result);
      // }
       handlePostLogin(username, result);
    } catch (err: any) {
      toast.error(err?.data?.message || err.message || "Login failed");
    }

  };

  const handlePostLogin = async (username: string, result: any) => {
    localStorage.setItem("userName", username);
    localStorage.setItem("isAdmin", String(result.admin));
    dispatch(setAccessToken(result));

    // New users (just verified email) go directly to onboarding.
    if (localStorage.getItem("isNewUser") === "true") {
      navigate("/onboarding");
      return;
    }

    // Returning users with no connected accounts haven't finished onboarding.
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/v1/auth/accounts/summary`,
        { headers: { Authorization: `Bearer ${result.accessToken}` } }
      );
      if (resp.ok) {
        const data = await resp.json();
        if (!data.accounts?.length) {
          navigate("/onboarding");
          return;
        }
      }
    } catch {
      // On error fall through to dashboard
    }

    toast.success("Logged in successfully.");
    navigate("/dashboard");
  };

  const handleSellerConfirm = async () => {
    const selectedSellers = sellerList.find(
      (s) => s.userId === selectedUserIds
    );

    if (!selectedSellers) {
      toast.error("Please select a seller.");
      return;
    }

    try {
      const modifiedUsername = `${loginInfo.username}/${selectedSellers.userId}`;
      const result = await signIn({
        email: modifiedUsername,
        password: loginInfo.password,
      }).unwrap();

      setSellerDialogOpen(false);
      handlePostLogin(modifiedUsername, result);
      toast.success(`Logged in as ${selectedSellers.sellerName}`);
    } catch (error: any) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    setOpenResetPasswordModal(true);
  };

  const handleAdminContinue = () => {
    if (!loginInfo.username || !loginInfo.password) {
      toast.error("Missing login info.");
      return;
    }

    if (!loginResult) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    handlePostLogin(loginInfo.username, loginResult);
    setSellerDialogOpen(false);
  };

  const inputClass =
    "w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/15";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[#334155]";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F4F7FF] via-[#F7F9FE] to-[#E9F0FE] font-poppins">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center gap-12 px-6 py-10 lg:flex-row lg:gap-16 lg:px-10">
        {/* Left: marketing */}
        <div className="w-full max-w-[560px]">
          <img src="/logo.png" alt="E2T Logo" className="mb-10 h-14 w-auto object-contain" />

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

        {/* Right: login card */}
        <div className="w-full max-w-[520px] rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] sm:p-10">
          <h2 className="text-[30px] font-bold text-[#0F172A]">Welcome back</h2>
          <p className="mt-1.5 text-[15px] text-[#64748B]">
            Log in to continue your migration.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className={labelClass}>Work Email</label>
              <input
                type="text"
                value={loginInfo.username}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, username: e.target.value })
                }
                placeholder="jane@acmecorp.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginInfo.password}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className={`${inputClass} pr-10`}
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

            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[13px] font-medium text-[#1D4ED8] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-[15px] text-[#64748B]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#1D4ED8] hover:underline"
            >
              Create your account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot password modal */}
      <ForgotPasswordModal
        open={openResetPasswordModal}
        onClose={() => setOpenResetPasswordModal(false)}
      />

      {/* Seller selection dialog */}
      <Dialog
        open={sellerDialogOpen}
        onClose={() => setSellerDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select a Seller</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            <List>
              {sellerList.map((seller) => (
                <ListItem key={seller.userId} disablePadding>
                  <ListItemButton
                    selected={selectedUserIds === seller.userId}
                    onClick={() => setSelectedUserIds(seller.userId)}
                  >
                    <ListItemText
                      primary={seller.sellerName}
                      secondary={`${seller.email} (User ID: ${seller.userId})`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdminContinue}>Skip</Button>
          <Button
            onClick={handleSellerConfirm}
            disabled={selectedUserIds === null}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
