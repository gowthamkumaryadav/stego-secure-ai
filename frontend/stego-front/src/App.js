import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Encode from "./pages/Encode";
import Decode from "./pages/Decode";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { useState, useEffect } from "react";

// 🔐 Protected Route with redirect back
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const user = localStorage.getItem("user");

  // ✅ Handle invalid values
  if (!user || user === "undefined" || user === "null") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

function App() {
  const user = localStorage.getItem("user");
  useEffect(() => {
    fetch("https://stego-backend-production.up.railway.app")
      .then(() => console.log("Backend awake"))
      .catch(() => console.log("Backend waking..."));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />

        {/* PROTECTED */}
        <Route
          path="/encode"
          element={
            <ProtectedRoute>
              <Encode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/decode"
          element={
            <ProtectedRoute>
              <Decode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔥 VERY IMPORTANT */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
