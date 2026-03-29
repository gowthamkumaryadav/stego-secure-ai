import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchDashboard();
      fetchHistory();
    }
  }, [user, navigate]);

  // 🔥 FETCH COUNTS
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `https://stego-backend-production.up.railway.app/stego/dashboard?username=${user}`
      );
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  // 🔥 FETCH HISTORY
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `https://stego-backend-production.up.railway.app/stego/history?username=${user}`
      );
      setHistory(res.data);
    } catch (err) {
      console.error("History Error:", err);
    }
  };

  // ✅ SORT LATEST FIRST
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* 🔥 HEADER */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* 🧠 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Encoded Images", value: stats.encoded || 0 },
          { title: "Decoded Messages", value: stats.decoded || 0 },
          { title: "Secure Messages", value: stats.secure || 0 },
          { title: "Activity", value: "Active" },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md shadow-lg transition"
          >
            <h2 className="text-lg opacity-80">{card.title}</h2>
            <p className="text-2xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => navigate("/encode")}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:scale-105 transition"
        >
          Encode
        </button>

        <button
          onClick={() => navigate("/decode")}
          className="px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 hover:scale-105 transition"
        >
          Decode
        </button>
      </div>

      {/* 📊 RECENT ACTIVITY */}
      <div className="bg-white/20 dark:bg-white/10 backdrop-blur-lg p-5 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        {sortedHistory.length === 0 ? (
          <p className="text-gray-400">No activity yet</p>
        ) : (
          <ul>
            {sortedHistory.slice(0, 10).map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 py-3"
              >
                {/* FILE NAME */}
                <span className="font-medium truncate">
                  {item.fileName || item.filename || "No Name"}
                </span>

                {/* TYPE */}
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-md ${
                    item.type?.includes("ENCODE")
                      ? "text-blue-500"
                      : item.type?.includes("DECODE")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🖼 LAST ENCODED IMAGE */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Last Encoded Image</h2>

        {sortedHistory.some((item) => item.type?.includes("ENCODE")) ? (
          <p className="text-green-500">
            Image saved successfully:{" "}
            {
              sortedHistory.find((item) =>
                item.type?.includes("ENCODE")
              )?.fileName || "Unknown"
            }
          </p>
        ) : (
          <p className="text-gray-400">No encoded images yet</p>
        )}
      </div>
    </div>
  );
}