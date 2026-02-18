import { useState } from "react";

import api from "../api";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try{
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", {
      email,
      password,
    });

    const token = res.data.token;

    localStorage.setItem("token", token);

    navigate("/requests");
    }catch (err) {
      setError("Invalid email or password");
    }finally {
      setLoading(false);
    }
    
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Welcome Back
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
            onClick={handleLogin}

            // Disable button while loading (prevents double click)
            disabled={loading}

            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white 
            font-medium hover:bg-indigo-700 transition 
            focus:outline-none focus:ring-2 focus:ring-indigo-400 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Change text while loading */}
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}
      </div>

      <p className="text-sm text-gray-500 text-center mt-6">
        Don’t have an account?{" "}
        <span
          className="text-indigo-600 hover:underline cursor-pointer font-medium"
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  </div>
);

}
