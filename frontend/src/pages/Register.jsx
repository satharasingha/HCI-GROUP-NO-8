import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import room from "../assets/room.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Registration failed");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-stone-200">
        {/* LEFT SIDE FORM */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-white to-warm-50">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.png"
              alt="RoomCraft"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-light text-stone-900">
              Room<span className="text-amber-800 font-normal">Craft</span>
            </span>
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-light text-stone-900 mb-2">
            Join RoomCraft
          </h2>
          <p className="text-stone-500 mb-6">
            Create your furniture design account and start creating beautiful
            spaces.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white transition-all"
              />

              <InputField
                label="Work Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@roomcraft.com"
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white transition-all"
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white transition-all"
              />

              <InputField
                label="Verify Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white transition-all"
              />
            </div>

            {/* TERMS */}
            <p className="text-sm text-stone-500 mt-8">
              By creating an account, you agree to our
              <span className="text-amber-700 ml-1 cursor-pointer hover:text-amber-800 transition-colors">
                Terms of Service
              </span>
              <span className="text-amber-700 ml-1 cursor-pointer hover:text-amber-800 transition-colors">
                and Privacy Policy
              </span>
            </p>

            {/* BUTTON */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
              <span className="text-sm text-stone-500">
                Already have an account?
                <Link
                  to="/login"
                  className="text-amber-700 ml-2 text-sm cursor-pointer hover:text-amber-800 hover:underline transition-colors"
                >
                  Log in instead
                </Link>
              </span>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-amber-800 to-stone-800 text-white rounded-lg hover:from-amber-900 hover:to-stone-900 transition-all duration-300 font-medium disabled:from-amber-300 disabled:to-stone-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-amber-900/20"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account →"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex bg-gradient-to-br from-amber-50 to-stone-50 items-center justify-center p-10">
          <div className="text-center">
            <div className="relative">
              <img
                src={room}
                alt="Room"
                className="rounded-xl shadow-2xl mb-6 max-w-md border-4 border-white"
              />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-amber-800/10 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-xl font-light text-stone-900">
              RoomCraft Design Studio
            </h3>
            <p className="text-stone-500 text-sm mt-2 max-w-sm">
              Unlock the full potential of 3D furniture visualization and create
              your perfect space with RoomCraft.
            </p>

            {/* Decorative elements */}
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-2 h-2 rounded-full bg-amber-800"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400"></span>
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
