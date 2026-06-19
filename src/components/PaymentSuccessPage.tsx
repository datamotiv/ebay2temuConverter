import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) navigate("/dashboard");
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full animate-fadeIn">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-5xl">
            ✔
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 text-lg">
          Thank you for your purchase. You're being redirected...
        </p>

        <p className="mt-4 text-gray-500 text-sm">
          Redirecting in <span className="font-semibold text-green-700">{counter}</span> seconds
        </p>

        <div className="mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Go Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
