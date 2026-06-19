// src/components/StripeReturnPage.tsx

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StripeReturnPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  // console.log(queryParams, 'what is parasm');
  const sessionId = queryParams.get("session_id");
  // console.log(sessionId, 'what is parasm');
  useEffect(() => {
    if (!sessionId) {
      // Optionally redirect if no session_id is found
      navigate("/dashboard");
    }
  }, [sessionId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      {sessionId ? (
        <>
          <h1 className="text-2xl font-semibold text-green-600">
            🎉 Payment Successful!
          </h1>
          <p className="text-sm text-gray-700">
            Thank you for your payment. 
          </p>
          {/* <code className="bg-gray-100 px-4 py-2 rounded">{sessionId}</code> */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl text-red-500 font-medium">Payment Failed or Cancelled</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default StripeReturnPage;
