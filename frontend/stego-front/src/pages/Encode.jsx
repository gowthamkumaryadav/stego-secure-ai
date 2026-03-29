import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import { encodeImage } from "../api/stegoApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Encode() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔐 Protect route
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login", { state: { from: "/encode" } });
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleEncode = async () => {
    console.log("NOW IT WILL WORK");
    if (!file) {
      alert("⚠️ Please select an image");
      return;
    }

    if (!message) {
      alert("⚠️ Please enter a message");
      return;
    }

    if (!password) {
      alert("⚠️ Please enter a password");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("message", message);
      formData.append("password", password);
      formData.append("username", user);

      const res = await encodeImage(formData);

      if (!res || !res.data) {
        throw new Error("No response from server");
      }

      // ✅ Download encoded image
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "encoded.png";
      link.click();

      // 🔥 Reset form after success
      setMessage("");
      setPassword("");
      setFile(null);
      setPreview(null);

      alert("✅ Encoding successful!");
    } catch (err) {
      console.error(err);
      alert("❌ Encoding failed");
    }

    setLoading(false);
  };
  const getStrength = (password) => {
    if (password.length < 6)
      return { text: "Weak", color: "bg-red-500", width: "33%" };
    if (password.length < 10)
      return { text: "Medium", color: "bg-yellow-500", width: "66%" };
    return { text: "Strong", color: "bg-green-500", width: "100%" };
  };
  const generateMessage = () => {
    const messages = [
      "Confidential data secured 🔐",
      "Top secret message hidden successfully",
      "Secure communication enabled 🚀",
      "Highly encrypted sensitive data",
    ];

    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto mt-12 px-4"
      >
        {/* 🔥 CARD */}
        <div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl 
      rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >
          {/* TITLE */}
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Encode Message
          </h2>

          {/* UPLOAD */}
          <UploadBox
            setFile={setFile}
            setPreview={setPreview}
            resetForm={() => {
              setMessage("");
              setPassword("");
            }}
          />

          {/* PREVIEW */}
          {preview && (
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 rounded-lg mt-4 shadow flex items-center justify-center overflow-hidden">
              <motion.img
                src={preview}
                alt="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {/* MESSAGE */}
          <div className="flex items-center gap-2 mt-5">
            <textarea
              value={message}
              placeholder="Enter secret message..."
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 outline-none transition
            dark:bg-gray-900 text-gray-900 dark:text-white"
            />

            {/* AI BUTTON */}
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={generateMessage}
                className="w-11 h-11 flex items-center justify-center 
              rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 
              text-white shadow-lg"
              >
                🤖
              </motion.button>

              <span
                className="absolute right-0 bottom-14 
              bg-black text-white text-xs px-2 py-1 rounded 
              opacity-0 group-hover:opacity-100 transition"
              >
                Generate AI Message
              </span>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="relative mt-5">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter password..."
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg pr-10
            focus:ring-2 focus:ring-blue-500 outline-none transition
            dark:bg-gray-900 text-gray-900 dark:text-white"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:scale-110 transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* 🔥 PASSWORD STRENGTH BAR */}
          {password && (
            <div className="mt-2">
              {/* TEXT */}
              <p
                className={`text-sm font-medium ${
                  getStrength(password).text === "Weak"
                    ? "text-red-500"
                    : getStrength(password).text === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              >
                {getStrength(password).text}
              </p>

              {/* BAR */}
              <div className="h-2 w-full bg-gray-200 rounded mt-1">
                <div
                  className={`h-2 rounded transition-all duration-500 ${getStrength(password).color}`}
                  style={{ width: getStrength(password).width }}
                ></div>
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEncode}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-lg font-semibold shadow-md transition-all
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
          }`}
          >
            {loading ? "Encoding..." : "Encode & Download"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
