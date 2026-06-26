/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { X, MailCheck, Loader2 } from "lucide-react";
import { useForgotPasswordTemuMutation } from "../Redux/features/auth/temuAuthApi";

const ForgotPasswordModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordTemuMutation();

  // Reset internal state whenever the modal is reopened.
  useEffect(() => {
    if (open) {
      setEmail("");
      setSent(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Endpoint always returns 201 regardless of whether the email exists.
      await forgotPassword({ email }).unwrap();
    } catch {
      // Intentionally ignore errors to avoid leaking which emails exist.
    } finally {
      setSent(true);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/15";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxWidth: "440px",
          width: "100%",
          boxShadow: "0 20px 60px -15px rgba(15,23,42,0.25)",
        },
      }}
    >
      <div className="font-poppins p-7 sm:p-8">
        {sent ? (
          <div className="py-2 text-center">
            <MailCheck className="mx-auto h-12 w-12 text-[#1D4ED8]" />
            <h2 className="mt-5 text-[22px] font-bold text-[#0F172A]">
              Check your inbox
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#64748B]">
              If an account exists for{" "}
              <span className="font-semibold text-[#334155]">{email}</span>,
              we've sent a password reset link. It expires in 15 minutes.
            </p>
            <button
              onClick={onClose}
              className="mt-7 w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[24px] font-bold text-[#0F172A]">
                  Reset password
                </h2>
                <p className="mt-1.5 text-[15px] text-[#64748B]">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 -mt-1 rounded-md p-1 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#334155]">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@acmecorp.com"
                  className={inputClass}
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-lg px-4 py-2.5 text-[15px] font-medium text-[#475569] transition hover:bg-[#F1F5F9] disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex min-w-[120px] items-center justify-center rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default ForgotPasswordModal;
