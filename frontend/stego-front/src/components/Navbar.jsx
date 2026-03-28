import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const links = [
    { path: "/", name: "Home" },
    { path: "/encode", name: "Encode" },
    { path: "/decode", name: "Decode" },
    { path: "/dashboard", name: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-3 items-center">

        {/* 🔥 LOGO */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="justify-self-start cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
            🔐 StegoSecure AI
          </h1>
        </motion.div>

        {/* 🔥 NAV LINKS */}
        <div className="flex justify-center gap-8 text-sm font-medium relative">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              className={({ isActive }) =>
                `relative px-1 transition duration-300 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative group">
                  {link.name}

                  {/* 🔥 UNDERLINE ANIMATION */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300
                    ${isActive ? "w-full bg-blue-600" : "w-0 bg-blue-500 group-hover:w-full"}`}
                  ></span>

                  {/* 🔥 ACTIVE GLOW */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-glow"
                      className="absolute inset-0 rounded-md bg-blue-100 dark:bg-blue-900/30 -z-10"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* 🔥 RIGHT SIDE */}
        <div className="flex justify-end items-center gap-4">

          {/* 🌙 DARK MODE */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-full 
            border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800
            hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {dark ? "☀️" : "🌙"}
          </motion.button>

          {/* 👤 PROFILE */}
          {user && (
            <div className="relative">

              {/* AVATAR */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                className="w-9 h-9 flex items-center justify-center rounded-full 
                bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold 
                cursor-pointer shadow-md"
              >
                {user.charAt(0).toUpperCase()}
              </motion.div>

              {/* 🔥 DROPDOWN */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                      {user}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
}