import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyGetAccountsSummaryQuery } from "../../Redux/features/migrations/migrationsApi";

export type StepKey = "welcome" | "ebay" | "temu" | "shipping" | "done";

export interface StepDef {
  key: StepKey;
  label: string;
  optional: boolean;
  completed: boolean;
}

const STEP_DEFS: Omit<StepDef, "completed">[] = [
  { key: "welcome", label: "Welcome", optional: false },
  { key: "ebay", label: "eBay Store", optional: true },
  { key: "temu", label: "Temu Store", optional: true },
  { key: "shipping", label: "Shipping", optional: true },
  { key: "done", label: "Done", optional: false },
];

const getSavedStep = () => {
  const saved = parseInt(sessionStorage.getItem("onboardingStep") || "0", 10);
  return isNaN(saved) ? 0 : saved;
};

export const useOnboardingState = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [fetchAccounts] = useLazyGetAccountsSummaryQuery();

  const [currentStep, setCurrentStep] = useState(getSavedStep);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isPollingEbay, setIsPollingEbay] = useState(false);
  const [completed, setCompleted] = useState<Record<StepKey, boolean>>({
    welcome: false,
    ebay: false,
    temu: false,
    shipping: false,
    done: false,
  });

  const advance = useCallback((step: number, dir: "forward" | "back" = "forward") => {
    setDirection(dir);
    setCurrentStep(step);
    sessionStorage.setItem("onboardingStep", String(step));
  }, []);

  const goNext = useCallback(() => {
    setDirection("forward");
    setCurrentStep((prev) => {
      if (prev === 0) {
        setCompleted((c) => ({ ...c, welcome: true }));
      }
      const next = prev + 1;
      sessionStorage.setItem("onboardingStep", String(next));
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection("back");
    setCurrentStep((prev) => {
      const next = Math.max(0, prev - 1);
      sessionStorage.setItem("onboardingStep", String(next));
      return next;
    });
  }, []);

  const skipStep = useCallback(() => goNext(), [goNext]);

  // Initialize: mark onboarding in progress, check existing account state
  useEffect(() => {
    localStorage.setItem("onboardingInProgress", "true");

    (async () => {
      try {
        const result = await fetchAccounts(undefined, false).unwrap();
        const accounts = result.accounts ?? [];
        const hasEbay = accounts.some((a) => a.provider === "EBAY");
        const hasTemu = accounts.some((a) => a.provider === "TEMU");

        setCompleted((prev) => ({
          ...prev,
          ebay: hasEbay,
          temu: hasTemu,
        }));
      } catch {
        // best-effort; proceed to onboarding
      } finally {
        setIsLoadingInitial(false);
      }
    })();

    return () => {
      localStorage.removeItem("onboardingInProgress");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect Temu OAuth return via ?connected=temu
  useEffect(() => {
    if (searchParams.get("connected") !== "temu") return;
    setCompleted((prev) => ({ ...prev, temu: true }));
    setSearchParams({}, { replace: true });
    advance(3, "forward"); // shipping step
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // eBay polling via visibility API + interval
  useEffect(() => {
    if (!isPollingEbay) return;

    const poll = async () => {
      try {
        const result = await fetchAccounts(undefined, false).unwrap();
        const hasEbay = (result.accounts ?? []).some((a) => a.provider === "EBAY");
        if (hasEbay) {
          setCompleted((prev) => ({ ...prev, ebay: true }));
          setIsPollingEbay(false);
          setDirection("forward");
          setCurrentStep((prev) => {
            const next = prev + 1;
            sessionStorage.setItem("onboardingStep", String(next));
            return next;
          });
        }
      } catch {
        // ignore, keep polling
      }
    };

    const interval = setInterval(poll, 3000);
    const timeout = setTimeout(() => setIsPollingEbay(false), 120_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") poll();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isPollingEbay, fetchAccounts]);

  const startEbayPolling = useCallback(() => setIsPollingEbay(true), []);
  const stopEbayPolling = useCallback(() => setIsPollingEbay(false), []);

  const onTemplateSelected = useCallback(() => {
    setCompleted((prev) => ({ ...prev, shipping: true }));
    goNext();
  }, [goNext]);

  const completeOnboarding = useCallback(() => {
    localStorage.removeItem("isNewUser");
    localStorage.removeItem("onboardingInProgress");
    sessionStorage.removeItem("onboardingStep");
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const steps: StepDef[] = STEP_DEFS.map((s) => ({
    ...s,
    completed: completed[s.key],
  }));

  return {
    currentStep,
    steps,
    direction,
    isLoadingInitial,
    isPollingEbay,
    completed,
    goNext,
    goBack,
    skipStep,
    startEbayPolling,
    stopEbayPolling,
    onTemplateSelected,
    completeOnboarding,
  };
};
