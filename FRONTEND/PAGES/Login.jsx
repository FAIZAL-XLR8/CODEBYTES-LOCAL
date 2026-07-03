import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../src/authSlice";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/* ── Floating stat card ── */
const StatCard = ({ children, className }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3 ${className}`}>
    {children}
  </div>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/problems");
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Welcome back to CodeBytes!");
      navigate("/problems");
    } catch (err) {
      const errorMessage =
        err?.message || err?.error || err?.data?.message || err?.toString() || "Login failed";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Top Bar ── */}
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="text-xl font-black text-gray-900 tracking-tight">
          Code<span className="text-emerald-500">Bytes</span><span className="text-emerald-500">.</span>
        </Link>
        <Link
          to="/signup"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-300 hover:border-emerald-400 hover:text-emerald-600 px-4 py-1.5 rounded-full transition-all"
        >
          New here? <span className="font-semibold text-gray-800">Sign Up</span>
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col md:flex-row items-start gap-16">

        {/* LEFT: Hero + Form */}
        <div className="w-full md:w-[46%] flex flex-col gap-8">

          {/* Hero Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
              Welcome Back,<br />
              <span className="text-emerald-500">Coder!</span> 👋
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Log in to continue your journey of<br className="hidden md:block" /> turning logic into mastery.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 w-full"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Login to <span className="text-emerald-500">Code<span className="text-gray-800">Bytes</span></span>
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 ${errors.email ? "border-red-400" : "border-gray-300"
                      }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>

                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 ${errors.password ? "border-red-400" : "border-gray-300"
                      }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-emerald-500/20"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>Login <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
              By logging in, you agree to our{" "}
              <span className="text-emerald-500 cursor-pointer hover:underline">Terms of Service</span>{" "}
              and{" "}
              <span className="text-emerald-500 cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </motion.div>
        </div>

        {/* RIGHT: Illustration */}
        <div className="hidden md:flex w-full md:w-[54%] justify-center items-start relative min-h-[520px]">

          {/* Code Editor Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-[340px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Editor top bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            {/* Code content */}
            <div className="p-5 font-mono text-sm leading-relaxed">
              <p className="text-blue-400">#include <span className="text-orange-400">&lt;bits/stdc++.h&gt;</span></p>
              <p className="text-blue-400">using namespace <span className="text-white">std</span>;</p>
              <p className="mt-2 text-purple-400">int <span className="text-yellow-300">main</span>() {"{"}</p>
              <p className="ml-4 text-white">ios::sync_with_stdio(false);</p>
              <p className="ml-4 text-white">cin.tie(nullptr);</p>
              <p className="ml-4 mt-2 text-blue-300">int <span className="text-white">n</span>;</p>
              <p className="ml-4 text-white">cin &gt;&gt; n;</p>
              <p className="ml-4 mt-2 text-gray-500">// Logic + Creativity</p>
              <p className="ml-4 text-gray-500">// Builds Mastery</p>
              <p className="ml-4 mt-2 text-blue-300">return <span className="text-orange-400">0</span>;</p>
              <p className="text-purple-400">{"}"}</p>
            </div>
          </motion.div>

          {/* Floating: Accepted */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" />
              <span className="text-xs font-semibold text-gray-700">Accepted</span>
            </div>
            <p className="text-xs text-emerald-500 font-medium mt-0.5">98.7% Runtime</p>
          </motion.div>

          {/* Floating: Daily Streak */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-24 left-0 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">Daily Streak</p>
                <p className="text-sm font-black text-gray-900">12 Days</p>
              </div>
            </div>
          </motion.div>

          {/* Floating: Problems Solved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute bottom-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" />
              <span className="text-xs font-semibold text-gray-700">Problems Solved</span>
            </div>
            <p className="text-xl font-black text-gray-900 mt-0.5">342</p>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="border-t border-gray-100 py-12 px-6 text-center">
        <p className="text-sm text-gray-500 mb-8">
          Join <span className="font-black text-gray-800">50K+</span> coders leveling up every day
        </p>

        {/* Company Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-12 opacity-50 grayscale">
          {["Google", "amazon", "Microsoft", "Adobe", "Meta", "SAMSUNG"].map((name) => (
            <span key={name} className="text-lg font-black text-gray-700">{name}</span>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          {[
            { icon: "💡", title: "Sharpen Logic", desc: "Solve handpicked problems that build strong foundations." },
            { icon: "🎯", title: "Crack Interviews", desc: "Prepare for top tech companies with real interview questions." },
            { icon: "📈", title: "Track & Improve", desc: "Monitor progress, build streaks, and keep getting better." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium text-gray-600">
          <strong>Break</strong> it down to{" "}
          <span className="text-emerald-500 font-bold">0</span>s and{" "}
          <span className="text-emerald-500 font-bold">1</span>s.
        </p>
      </div>
    </div>
  );
};

export default Login;
