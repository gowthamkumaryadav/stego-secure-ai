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

// 🔐 Protected Route with redirect back
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ LOGIN */}
        <Route
          path="/login"
          element={
            localStorage.getItem("user") ? <Navigate to="/" /> : <Login />
          }
        />

        {/* ✅ HOME (PUBLIC) */}
        <Route path="/" element={<Home />} />

        {/* 🔐 PROTECTED ROUTES */}
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
        {/* ✅ PUBLIC ROUTES */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
