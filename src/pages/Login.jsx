import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from '../services/api';


export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
  const newErrors = {};
  if (!formData.name || formData.name.trim().length < 3)
    newErrors.name = "Name must be at least 3 characters";
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    newErrors.email = "Enter a valid email address";
  if (!formData.password || formData.password.length < 6)
    newErrors.password = "Password must be at least 6 characters";
  if (formData.password !== formData.cPassword)
    newErrors.cPassword = "Passwords don't match";
  return newErrors;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate;
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      if (data.message == "Done") {
        toast.success(`Welcome back, ${data.user.name}!`);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 shadow-2xl rounded-3xl p-8 border border-zinc-800">

          <div className="flex flex-col items-center mb-8">
            <h1 style={{ fontFamily: "Pacifico, cursive" }} className="text-4xl text-cyan-400 mb-2">
              Writely
            </h1>
            <h2 className="text-xl font-bold text-white mt-1">Welcome Back</h2>
            <p className="text-zinc-500 text-sm mt-1">Login to continue your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-600 border outline-none focus:border-cyan-400 transition-colors ${errors.email ? "border-red-500" : "border-zinc-700"}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-600 border outline-none focus:border-cyan-400 transition-colors ${errors.password ? "border-red-500" : "border-zinc-700"}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm transition-colors mt-2"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login "}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}