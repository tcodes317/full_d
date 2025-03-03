import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const CodeVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // Update the individual digit inputs
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return; // Only allow one digit
    const updatedCode = [...code];
    updatedCode[index] = value.replace(/[^0-9]/g, ""); // Allow only numbers
    setCode(updatedCode);

    // Focus on the next input automatically
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join(""); // Combine all digits
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/verify-code", { code: verificationCode });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Enter Verification Code</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="#ffffff" /> : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodeVerification;