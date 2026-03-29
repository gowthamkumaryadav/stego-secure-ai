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

  // ✅ FIXED user
  const user = localStorage.getItem("user");

  // 🔐 Protect route
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/encode" } });
    }
  }, [navigate, user]);

  const handleEncode = async () => {
    if (!file) return alert("⚠️ Please select an image");
    if (!message) return alert("⚠️ Please enter a message");
    if (!password) return alert("⚠️ Please enter a password");

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

      // ✅ Download file
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "encoded.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset
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

  // 🔐 Password strength
  const getStrength = (password) => {
    if (password.length < 6)
      return { text: "Weak", color: "bg-red-500", width: "33%" };
    if (password.length < 10)
      return { text: "Medium", color: "bg-yellow-500", width: "66%" };
    return { text: "Strong", color: "bg-green-500", width: "100%" };
  };

  // 🤖 AI message
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto mt-12 px-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Encode Message
          </h2>

          {/* Upload */}
          <UploadBox
            setFile={setFile}
            setPreview={setPreview}
            resetForm={() => {
              setMessage("");
              setPassword("");
            }}
          />

          {/* Preview */}
          {preview && (
            <div className="w-full h-64 bg-gray-100 rounded-lg mt-4 flex items-center justify-center overflow-hidden">
              <motion.img
                src={preview}
                alt="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-h-full object-contain"
              />
            </div>
          )}

          {/* Message */}
          <div className="flex items-center gap-2 mt-5">
            <textarea
              value={message}
              placeholder="Enter secret message..."
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={generateMessage}
              className="w-11 h-11 rounded-full bg-purple-600 text-white hover:scale-110 transition"
            >
              🤖
            </button>
          </div>

          {/* Password */}
          <div className="relative mt-5">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter password..."
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-blue-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Strength Bar */}
          {password && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">
                Strength: {getStrength(password).text}
              </p>

              <div className="w-full h-2 bg-gray-300 rounded mt-1">
                <div
                  className={`h-2 rounded ${getStrength(password).color}`}
                  style={{ width: getStrength(password).width }}
                ></div>
              </div>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleEncode}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-lg font-semibold flex justify-center items-center gap-2
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Encoding...
              </>
            ) : (
              "Encode & Download"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
