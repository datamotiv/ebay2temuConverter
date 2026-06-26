/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useVerifyEmailMutation } from "../Redux/features/auth/temuAuthApi";

type Status = "verifying" | "success" | "error";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [verifyEmail] = useVerifyEmailMutation();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false); // guard against StrictMode double-invoke (token is single-use)

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    (async () => {
      try {
        const result = await verifyEmail({ token }).unwrap();
        setStatus("success");
        setMessage(result?.message || "Your email has been verified.");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err?.data?.message || "Invalid or expired verification link."
        );
      }
    })();
  }, [token, verifyEmail]);

  // On success, mark new user and send to login after a short pause.
  useEffect(() => {
    if (status !== "success") return;
    localStorage.setItem("isNewUser", "true");
    const timer = setTimeout(() => navigate("/login"), 4000);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F4F7FF] via-[#F7F9FE] to-[#E9F0FE] px-6 font-poppins">
      <div className="w-full max-w-[460px] rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)]">
        <h2 className="mb-8 text-xl font-bold text-[#1D4ED8]">eBay2Temu</h2>

        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#1D4ED8]" />
            <h1 className="mt-6 text-[24px] font-bold text-[#0F172A]">
              Verifying your email…
            </h1>
            <p className="mt-2 text-[15px] text-[#64748B]">
              Hang tight while we confirm your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#16A34A]" />
            <h1 className="mt-6 text-[24px] font-bold text-[#0F172A]">
              Email verified
            </h1>
            <p className="mt-2 text-[15px] text-[#64748B]">{message}</p>
            <p className="mt-1 text-[13px] text-[#94A3B8]">
              Redirecting you to login…
            </p>
            <Link
              to="/login"
              className="mt-7 inline-block w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-[#DC2626]" />
            <h1 className="mt-6 text-[24px] font-bold text-[#0F172A]">
              Verification failed
            </h1>
            <p className="mt-2 text-[15px] text-[#64748B]">{message}</p>
            <Link
              to="/login"
              className="mt-7 inline-block w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
            >
              Back to Login
            </Link>
            <Link
              to="/register"
              className="mt-3 inline-block text-[14px] font-medium text-[#1D4ED8] hover:underline"
            >
              Create a new account
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
