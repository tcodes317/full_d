import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const email = searchParams.get("email");
    const hash = searchParams.get("hash");

    if (!email || !hash) {
      setStatus("invalid");
      return;
    }

    // Send verification request
    axios
      .get(`http://localhost:5000/verify?email=${email}&hash=${hash}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        {status === "loading" && <p className="text-gray-600">Verifying email...</p>}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h2>
            <p className="text-gray-700">Your email has been successfully registered.</p>
            <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
              Go to Login
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p className="text-gray-700">Invalid or expired verification link.</p>
          </>
        )}
        {status === "invalid" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Request</h2>
            <p className="text-gray-700">Email or hash parameter missing.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;