import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import { encodeImage } from "../api/stegoApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Encode() {
  console.log("ENCODE PAGE LOADED");

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ Correct user retrieval
  const user = localStorage.getItem("user");

  // 🔐 Protect route
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/encode" } });
    }
  }, [navigate, user]);

  const handleEncode = async () => {
    console.log("ENCODE CLICKED");

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

      console.log("Sending request...");

      const res = await encodeImage(formData);

      console.log("Response:", res);

      if (!res || !res.data) {
        throw new Error("No response from server");
      }

      // ✅ Download file safely
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "encoded.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset form
      setMessage("");
      setPassword("");
      setFile(null);
      setPreview(null);

      alert("✅ Encoding successful!");
    } catch (err) {
      console.error("ENCODE ERROR:", err);
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
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Encode Message
          </h2>

          <UploadBox
            setFile={setFile}
            setPreview={setPreview}
            resetForm={() => {
              setMessage("");
              setPassword("");
            }}
          />

          {preview && (
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 rounded-lg mt-4 shadow flex items-center justify-center overflow-hidden">
              <motion.img
                src={preview}
                alt="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-5">
            <textarea
              value={message}
              placeholder="Enter secret message..."
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={generateMessage}
              className="w-11 h-11 rounded-full bg-purple-600 text-white"
            >
              🤖
            </button>
          </div>

          <div className="relative mt-5">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter password..."
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg pr-10"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {password && (
            <div className="mt-2">
              <p>{getStrength(password).text}</p>
              <div className="h-2 w-full bg-gray-200 rounded mt-1">
                <div
                  className={getStrength(password).color}
                  style={{ width: getStrength(password).width }}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={handleEncode}
            disabled={loading}
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Encoding..." : "Encode & Download"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
