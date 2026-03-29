import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import { decodeImage } from "../api/stegoApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Decode() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  // 🔐 Protect route
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/decode" } });
    }
  }, [user, navigate]);

  // 🔥 Decode
  const handleDecode = async () => {
    if (!file) return alert("⚠️ Please select an image");
    if (!password) return alert("⚠️ Please enter password");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      formData.append("username", user);

      const res = await decodeImage(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Decoding failed (wrong password or invalid image)");
      setResult("");
    }

    setLoading(false);
  };

  // 🤖 AI Detect
  const handleAIDetect = async () => {
    try {
      if (!file) return alert("Please select image");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://stego-secure-ai-1.onrender.com/stego/ai-detect", {
        method: "POST",
        body: formData,
      });

      const data = await res.text();
      alert(data);
    } catch (err) {
      console.error(err);
      alert("AI Detection failed");
    }
  };

  const primaryBtn =
    "w-full py-2 rounded-lg text-white font-semibold tracking-wide shadow-md transition duration-200 hover:scale-[1.02] active:scale-[0.98]";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-xl text-black-500 mb-4 font-semibold">
          Decode Message
        </h2>

        {/* 🔥 Upload (WITH RESET FIX) */}
        <UploadBox
          setFile={(file) => {
            setFile(file);
            setPassword("");   // 🔥 RESET PASSWORD
            setResult("");     // optional: clear result
          }}
          setPreview={setPreview}
        />

        {/* 🖼️ Preview (NO CROP FIX) */}
        {preview && (
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 rounded-lg mt-4 shadow flex items-center justify-center overflow-hidden">
            <motion.img
              src={preview}
              alt="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
            />
          </div>
        )}

        {/* 🔐 Password */}
        <div className="relative mb-3 mt-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg pr-10 outline-none
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-900 text-gray-900 dark:text-white"
          />

          {/* 👁️ Eye */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-blue-500 transition"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* ⏳ Loading */}
        {loading && (
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 🔘 Buttons */}
        <div className="flex gap-3 mt-4 items-center">
          <button
            onClick={handleDecode}
            disabled={loading}
            className={`${primaryBtn} ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Decoding..." : "Decode"}
          </button>

          {/* 🤖 AI */}
          <div className="relative group">
            <button
              onClick={handleAIDetect}
              className="w-12 h-12 flex items-center justify-center 
              rounded-lg bg-purple-500 text-white shadow-md 
              hover:bg-purple-600 hover:scale-105 transition"
            >
              🤖
            </button>

            <span
              className="absolute left-1/2 -translate-x-1/2 -top-10 
              bg-black text-white text-xs px-3 py-1 rounded 
              opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50"
            >
              AI Detect Hidden Data
            </span>
          </div>
        </div>

        {/* 📩 Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow"
          >
            <p className="text-green-600 font-semibold mb-1">
              Decoded Message:
            </p>
            <p className="text-black dark:text-white break-words">
              {result}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}