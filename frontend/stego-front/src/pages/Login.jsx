import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../api/stegoApi";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // 🔐 Normal Login
  const handleLogin = async () => {
    if (!username || !password) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://stego-backend-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );

      const text = await res.text();

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", text);

      if (text.toLowerCase().includes("success")) {
        localStorage.setItem("user", username);
        navigate("/");
      } else {
        alert("❌ Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network error (backend waking up, try again)");
    }

    setLoading(false);
  };

  // 🔥 Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", user.displayName);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-10 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-4 tracking-wide">
          StegoSecure AI
        </h1>
        <p className="text-gray-400 text-center max-w-sm">
          Secure your messages using advanced image steganography with AI
          detection.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-80 animate-slideUp">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sign in</h2>

          {/* USERNAME */}
          <div className="relative mb-5">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-black outline-none peer"
              placeholder=" "
            />
            <label
              className="absolute left-3 top-3 text-gray-400 text-sm transition-all 
              peer-placeholder-shown:top-3 
              peer-placeholder-shown:text-base 
              peer-focus:top-[-10px] 
              peer-focus:text-sm 
              peer-focus:text-black bg-white px-1"
            >
              Username
            </label>
          </div>

          {/* PASSWORD */}
          <div className="relative mb-5">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-black outline-none pr-10 peer"
              placeholder=" "
            />

            <label
              className="absolute left-3 top-3 text-gray-400 text-sm transition-all 
              peer-placeholder-shown:top-3 
              peer-placeholder-shown:text-base 
              peer-focus:top-[-10px] 
              peer-focus:text-sm 
              peer-focus:text-black bg-white px-1"
            >
              Password
            </label>

            {/* 👁️ Eye */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-sm text-gray-400">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 border rounded flex items-center justify-center gap-3 
            hover:bg-gray-50 transition shadow-sm hover:shadow-md"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* 🔥 Animations */}
      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}
      </style>
    </div>
  );
}
