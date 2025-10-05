import React from "react";
import Loader from "../Loader";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
       

        try {
            // Simulate an API call
           const response = await fetch(`${import.meta.env.VITE_API_URI}/user/password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            
            const data = await response.json();
            if (data.success === false) {
                toast.error(data.message || "Login failed. Please try again.");
            }
            if(data.success === true   ){
            Cookies.set("user", JSON.stringify(data.user),{ expires: 7 }); 
            // Store token in cookies for 7 days
            sessionStorage.setItem("token", data.user.token);
                setEmail("");
                setPassword(""); 
                setLoading(false); 
            }
   
                 toast.success(data.message || "Login successful!");
                 navigate("/");
            // Handle successful login (e.g., store token, redirect)    

        } catch (err) {
           toast.error(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if(loading){
        return <Loader/>
    }
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-[90%] max-w-md p-8 bg-gray-900 border border-gray-800 shadow-md shadow-gray-800 rounded-xl">
        {/* Brand */}
        <h1 className="text-3xl flex items-center justify-center border-b border-gray-700 text-gray-300 uppercase font-bold pb-3">
          Kra<span className="text-orange-400">viona</span>
        </h1>

        {/* Login Form */}
        <div className="mt-8">
          <h2 className="text-2xl text-center text-white font-semibold mb-6">
            Login
          </h2>

          <div className="flex flex-col gap-5">
            <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:border-orange-500"
            />
            <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:border-orange-500"
            />
            <button onClick={handleLogin} className="w-full p-3 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all duration-200">
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center my-6 text-gray-400">
            <span className="w-1/4 border-t border-gray-700"></span>
            <span className="px-3 text-sm">or</span>
            <span className="w-1/4 border-t border-gray-700"></span>
          </div>

          {/* OTP Option */}
          <div className="text-center">
            <button className="text-orange-400 hover:text-orange-500 font-medium transition-colors">
              Login with OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
