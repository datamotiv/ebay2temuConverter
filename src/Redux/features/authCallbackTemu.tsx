import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const status = params.get("status");
    const sellerId = params.get("sellerId");

    console.log("Status:", status);
    console.log("SellerId:", sellerId);

    if (status === "success") {
      navigate("/login");
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