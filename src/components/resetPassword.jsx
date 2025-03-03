import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import CryptoJS from "crypto-js";

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Added email field
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Encrypt token before sending to backend
  const encryptToken = (token) => {
    const secretKey = "your-secret-key"; // Secret key for encryption
    const encrypted = CryptoJS.AES.encrypt(token, secretKey).toString();
    return encodeURIComponent(encrypted); // Ensure it is URL-safe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!email) {
      toast.error("Email is required!");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const encryptedToken = encryptToken(token);

      const response = await axios.post(
        `http://localhost:5000/reset-password/${encryptedToken}`,
        { email, newPassword, confirmPassword }
      );

      toast.success(response.data.message);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        toast.info("Redirecting to login page...");
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error);
      toast.error(error?.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;