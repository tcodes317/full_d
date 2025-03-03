import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; 
import { ClipLoader } from "react-spinners"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded" disabled={loading}>
          {loading ? <ClipLoader size={24} color="#ffffff" /> : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;