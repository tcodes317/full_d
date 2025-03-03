import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader, PulseLoader } from "react-spinners";

const AdminRegister = () => {
  const [infoData, setInfoData] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false); // for redirecting loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfoData({ ...infoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Check for empty fields

    if(!infoData.fullname || !infoData.email || !infoData.password){
        return toast.error("All fields are required.")
    }

    setLoading(true); // show loader

    setTimeout(async ()=>{
    try {
      const response = await axios.post("http://localhost:5000/admin/register", infoData);
      const { message } = response.data;

      toast.success(message);

      // Redirecting to login after 4 seconds

      setLoading(false); // stop initial loading
      // setRedirecting(true); // start redirect loading

      // Redirect after 2 seconds of loading animation
      setTimeout(()=>{
        setRedirecting(true);
        setTimeout(()=>{
          navigate("/admin/login")
        }, 2000)
      }, 2500);
    } catch (error) {
      setLoading(false); // Stop loading spinner

      if(error.response && error.response.data.message){
        // Show error message and redirect to login after 2 seconds

        toast.error("Email already exists. Please Login");
        // setRedirecting(true); // Start redirect loading for error case

        setTimeout(()=>{
        // Redirect after 2 seconds of loading animation
        setRedirecting(true); // start redirect animation after 4 seconds
        setTimeout(()=>{
          navigate("/admin/login"); //Redirect after 2 seconds of loading animation
        }, 2000); // 2 seconds for redirect animation
      }, 3000); // 4 seconds delay for showing redirect message
      }
      else{
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, 1000) // Delay registration logic by 4 seconds
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Register</h2>
        <div className="mb-4">
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={infoData.fullname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={infoData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={infoData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition ${
            loading || redirecting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || redirecting}
        >
          {loading ? <ClipLoader /> : "Register"}
        </button>
        <Link to="/admin/login" className="w-full py-2 rounded block bg-black text-white mt-2 text-center border-2 border-black hover:text-black hover:transition-all hover:bg-white">
          <button>Login</button>
        </Link>

        {/* Show redirecting animation */}
        {redirecting && (
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="mb-2 flex items-center space-x-2">
              {/* <ClipLoader size={30} color="#36d7b7" /> */}
              <span className="text-green-500">Redirecting to login...</span>
            </div>
            <PulseLoader size={10} color="#36d7b7" />
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminRegister;