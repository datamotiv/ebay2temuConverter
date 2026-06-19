import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard"); // Redirect home after 5 sec
    }, 5000);
  }, [navigate]);

  return (
    <div>
      <h1>Payment Cancelled</h1>
      <p>Redirecting to homepage...</p>
    </div>
  );
};

export default PaymentFailurePage;
