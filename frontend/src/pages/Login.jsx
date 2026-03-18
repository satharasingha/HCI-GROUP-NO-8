import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Invalid credentials");
      }

      // Save token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to designer
      navigate("/designer");

      // Reload to update navbar state
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center p-4">
      {/* login card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-stone-200">
        {/* logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="RoomCraft"
            className="w-20 h-20 object-contain mb-2"
          />
          <h1 className="text-2xl font-light text-stone-900">
            Room<span className="text-amber-800 font-normal">Craft</span>
          </h1>
          <p className="text-stone-400 text-sm tracking-wide">
            FURNITURE DESIGN STUDIO
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* email */}
          <div className="mb-4">
            <label className="text-sm text-stone-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. designer@roomcraft.com"
              className="w-full mt-2 px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white transition-all"
              required
            />
          </div>

          {/* password */}
          <div className="mb-3">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-stone-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-amber-700 hover:text-amber-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* remember */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 rounded border-stone-300 text-amber-800 focus:ring-amber-800/20 focus:ring-2"
            />
            <span className="text-sm text-stone-600 ml-2">
              Remember this device
            </span>
          </div>

          {/* login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-800 to-stone-800 hover:from-amber-900 hover:to-stone-900 disabled:from-amber-300 disabled:to-stone-300 text-white font-medium py-3 rounded-xl shadow-lg shadow-amber-900/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                SIGNING IN...
              </>
            ) : (
              "SIGN IN TO ROOMCRAFT"
            )}
          </button>
        </form>

        {/* bottom link */}
        <p className="text-center text-sm text-stone-500 mt-6">
          New to RoomCraft?{" "}
          <Link
            to="/register"
            className="text-amber-700 font-medium hover:text-amber-800 hover:underline transition-colors"
          >
            Create account
          </Link>
        </p>

        {/* decorative element */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-800/50 to-stone-800/50 rounded-full"></div>
      </div>
    </div>
  );
}
