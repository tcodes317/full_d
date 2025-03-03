import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FaLinkedinIn, FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setRegisterLoading(true);
    setTimeout(() => {
      navigate("/register");
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", formData);

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";

      if (error.response?.status === 403) {
        toast.error("Please verify your email address before logging in.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-2 text-left">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border focus:outline-none rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-left">Password</label>
          <div className="flex border rounded items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-2 px-4 py-2 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="right-0 top-0.5 absolute mt-5 transform pr-2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
        </div>

        <div className="mt-2 text-left">
          <Link to="/forgot-password">
            <button className="mb-3">Forgot Password?</button>
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? <ClipLoader size={30} color="#ffffff" /> : "Login"}
        </button>

        <button
          onClick={handleRegisterClick}
          className="py-2 bg-black text-center text-black hover:text-black focus:text-black w-full block rounded-md mt-2 hover:bg-white hover:text-black hover:border-2 hover:border-black border-2 border-black hover:transition-all"
        >
          {registerLoading ? <ClipLoader size={20} color="#ffffff" /> : "Create an Account"}
        </button>
      </form>

      <div className="flex items-center py-8 space-x-4">
        <div className="p-2 flex items-center justify-center">
          <FaLinkedinIn />
        </div>
        <div className="p-2 flex items-center justify-center">
          <FaGoogle />
        </div>
        <div className="p-2 flex items-center justify-center">
          <FaFacebook />
        </div>
        <div className="p-2 flex items-center justify-center">
          <FaGithub />
        </div>
      </div>
    </div>
  );
};

export default Login;