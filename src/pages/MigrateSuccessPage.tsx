/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useCreateMigrationMutation } from "../Redux/features/migrations/migrationsApi";
import {
  loadPendingMigration,
  clearPendingMigration,
} from "../Redux/features/payments/paymentsApi";

type Stage = "processing" | "success" | "error" | "no-session";

const MigrateSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [stage, setStage] = useState<Stage>(sessionId ? "processing" : "no-session");
  const [migrationId, setMigrationId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [createMigration] = useCreateMigrationMutation();
  const calledRef = useRef(false);

  useEffect(() => {
    if (!sessionId || calledRef.current) return;
    calledRef.current = true;

    const pending = loadPendingMigration();
    if (!pending) {
      // Payment succeeded but no pending migration data — just go to dashboard.
      navigate("/dashboard");
      return;
    }

    (async () => {
      try {
        const result = await createMigration({
          orderId: pending.orderId,
          accountId: pending.accountId,
          sellerId: pending.sellerId,
          sourceListingIds: pending.selectedIds,
        }).unwrap();

        clearPendingMigration();
        setMigrationId(result.migrationId);
        setStage("success");
      } catch (e: any) {
        setErrorMsg(e?.data?.message || "Failed to start migration. Please contact support.");
        setStage("error");
      }
    })();
  }, [sessionId, createMigration, navigate]);

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (stage !== "success") return;
    const dest = migrationId
      ? `/dashboard?tab=migrations&highlight=${migrationId}`
      : "/dashboard";
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(dest);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, navigate, migrationId]);

  if (stage === "processing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-white px-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#1D4ED8]" />
        <h1 className="text-xl font-semibold text-[#0F172A]">Setting up your migration…</h1>
        <p className="text-[14px] text-[#64748B]">Payment confirmed. Creating migration job, please wait.</p>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-green-50 to-white px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0F172A]">Payment successful!</h1>
          <p className="mt-2 text-[15px] text-[#475569]">
            Your migration has been queued. A receipt has been sent to your email.
          </p>
          {migrationId && (
            <p className="mt-1 text-[13px] text-[#94A3B8]">Migration ID: {migrationId}</p>
          )}
        </div>
        <p className="text-[13px] text-[#94A3B8]">Redirecting to your migration in {countdown} second{countdown !== 1 ? 's' : ''}…</p>
        <button
          onClick={() =>
            navigate(
              migrationId
                ? `/dashboard?tab=migrations&highlight=${migrationId}`
                : "/dashboard"
            )
          }
          className="rounded-lg bg-[#1D4ED8] px-6 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-red-50 to-white px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0F172A]">Migration failed to start</h1>
          <p className="mt-2 max-w-sm text-[14px] text-[#64748B]">{errorMsg}</p>
          <p className="mt-1 text-[13px] text-[#94A3B8]">
            Your payment was received. Please contact support if this persists.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-lg bg-[#1D4ED8] px-6 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // no-session — user landed here without a session_id (e.g. direct URL)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-xl font-semibold text-[#0F172A]">No active session</h1>
      <button
        onClick={() => navigate("/dashboard")}
        className="rounded-lg bg-[#1D4ED8] px-6 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default MigrateSuccessPage;
