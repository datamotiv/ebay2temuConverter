import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useOnboardingState } from "./useOnboardingState";
import OnboardingProgressBar from "./components/OnboardingProgressBar";
import StepIndicator from "./components/StepIndicator";
import StepWrapper from "./components/StepWrapper";
import WelcomeStep from "./steps/WelcomeStep";
import ConnectEbayStep from "./steps/ConnectEbayStep";
import ConnectTemuStep from "./steps/ConnectTemuStep";
import ShippingTemplateStep from "./steps/ShippingTemplateStep";
import DoneStep from "./steps/DoneStep";

const OnboardingPage = () => {
  const state = useOnboardingState();
  const {
    currentStep,
    steps,
    direction,
    isLoadingInitial,
    isPollingEbay,
    completed,
    goNext,
    skipStep,
    startEbayPolling,
    onTemplateSelected,
    completeOnboarding,
  } = state;

  if (isLoadingInitial) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#EB232E]" />
      </div>
    );
  }

  const stepComponents = [
    <WelcomeStep onNext={goNext} />,
    <ConnectEbayStep
      alreadyConnected={completed.ebay}
      isPolling={isPollingEbay}
      onConnect={startEbayPolling}
      onSkip={skipStep}
      onContinue={goNext}
    />,
    <ConnectTemuStep
      alreadyConnected={completed.temu}
      ebayConnected={completed.ebay}
      onSkip={skipStep}
      onContinue={goNext}
    />,
    <ShippingTemplateStep
      alreadySelected={completed.shipping}
      temuConnected={completed.temu}
      onSave={onTemplateSelected}
      onSkip={skipStep}
    />,
    <DoneStep onComplete={completeOnboarding} />,
  ];

  const safeStep = Math.min(currentStep, stepComponents.length - 1);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FC] font-poppins">
      {/* Logo bar */}
      <header className="flex items-center border-b border-[#F1F5F9] bg-white px-6 py-4">
        <img src="/logo.png" alt="eBay2Temu" className="h-9 w-auto object-contain" />
      </header>

      {/* Animated progress bar */}
      <OnboardingProgressBar current={safeStep} total={steps.length} />

      {/* Step indicator */}
      <StepIndicator steps={steps} current={safeStep} />

      {/* Animated step content */}
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-4">
        <AnimatePresence mode="wait" custom={direction}>
          <StepWrapper key={safeStep} direction={direction}>
            {stepComponents[safeStep]}
          </StepWrapper>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OnboardingPage;
