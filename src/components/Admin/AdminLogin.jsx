import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import zxcvbn from "zxcvbn";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] =  useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility=()=>{
    setShowPassword((prevState) => !prevState);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if(e.target.name === "password"){
      validatePasswordStrength(e.target.value);
    }
  };

  const validatePasswordStrength = (password) => {
    if (password.length > 20) {
      setPasswordError("Password cannot be more than 12 characters.");
      setPasswordStrength("");
    } else {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);

      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Making the API call to login
      const response = await axios.post("http://localhost:5000/admin/login", formData);
      
      // If login is successful, store the token and redirect to dashboard
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Show login successful toast
        toast.success("Login successful!");
        
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1200); // Delay to allow user to see success message before redirect
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Email not found.");
      } else if (error.response && error.response.status === 401) {
        toast.error("Invalid password.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to map password strength score to human-readable text
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <div className="flex border rounded items-center relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="right-2 top-10 mt-5 transform pr-2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
          </div>

          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          {passwordStrength >= 0 && !passwordError && (
            <p className="text-sm text-gray-600 mt-1">Strength: {getPasswordStrengthText()}</p>
          )}
        </div>
        <Link to="/forgot-password">
          <button className="mb-3">Forgot Password</button>
        </Link>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={30} color="#ffffff" />
          ) : (
            "Login"
          )}
        </button>
        <Link to="/admin/register" className="py-2 bg-black text-center text-white w-full block rounded-md mt-2 hover:bg-white hover:text-black hover:border-2 hover:border-black border-2 border-black hover:transition-all">
          <button>Create an Account</button>
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;