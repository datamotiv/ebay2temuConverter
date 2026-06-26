import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const status = params.get("status");
    const sellerId = params.get("sellerId");


    if (status === "success") {
      const isOnboarding = localStorage.getItem("onboardingInProgress") === "true";
      if (isOnboarding) {
        navigate("/onboarding?connected=temu", { replace: true });
      } else {
        navigate("/dashboard?connected=temu", { replace: true });
      }
    } else {
      navigate("/error");
    }
  }, [location, navigate]);

  return (
    <div>
     Connecting store
    </div>
  );
};

export default AuthCallback;