import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../src/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Check, Trophy, Zap } from "lucide-react";
import toast from "react-hot-toast";

const signupSchema = z
  .object({
    firstName: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be under 20 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Must contain uppercase, lowercase, number & special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch("password", "");
  const hasMinLength = passwordValue.length >= 8;
  const hasNumberOrSymbol = /[0-9@$!%*?&]/.test(passwordValue);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success(`Account created! Welcome, ${data.firstName}!`);
      navigate("/login");
    } catch (err) {
      toast.error("Error: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Top Bar ── */}
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="text-xl font-black text-gray-900 tracking-tight">
          Code<span className="text-emerald-500">Bytes</span><span className="text-emerald-500">.</span>
        </Link>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </header>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-start gap-16">

        {/* LEFT: Hero + Form */}
        <div className="w-full md:w-[46%] flex flex-col gap-7">

          {/* Hero Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
              Start Your Coding<br />
              <span className="text-emerald-500">Journey</span> Today! 🚀
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Create your account and start turning<br className="hidden md:block" /> logic into real-world impact.
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
              Create Your <span className="text-emerald-500">Code<span className="text-gray-800">Bytes</span></span> Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 ${
                      errors.firstName ? "border-red-400" : "border-gray-300"
                    }`}
                    {...register("firstName")}
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

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
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 ${
                      errors.email ? "border-red-400" : "border-gray-300"
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 ${
                      errors.password ? "border-red-400" : "border-gray-300"
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

                {/* Password hints */}
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center gap-1.5 text-xs transition-colors ${hasMinLength ? "text-emerald-500" : "text-gray-400"}`}>
                    <Check size={12} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs transition-colors ${hasNumberOrSymbol ? "text-emerald-500" : "text-gray-400"}`}>
                    <Check size={12} />
                    <span>Includes number or symbol</span>
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 ${
                      errors.confirmPassword ? "border-red-400" : "border-gray-300"
                    }`}
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-emerald-500/20 mt-1"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>Sign Up <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
              By signing up, you agree to our{" "}
              <span className="text-emerald-500 cursor-pointer hover:underline">Terms of Service</span>{" "}
              and{" "}
              <span className="text-emerald-500 cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </motion.div>
        </div>

        {/* RIGHT: Illustration */}
        <div className="hidden md:flex w-full md:w-[54%] justify-center items-start relative min-h-[560px]">

          {/* Floating: Top 1% Rank */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3"
          >
            <p className="text-xs text-gray-500 font-medium">Top 1%</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Trophy size={14} className="text-yellow-500" />
              <p className="text-sm font-black text-gray-900">Rank #213</p>
            </div>
          </motion.div>

          {/* Central Illustration — coder figure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 flex flex-col items-center"
          >
            {/* Code badge */}
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-emerald-500/30 mb-6">
              {"</>"}
            </div>
            {/* Illustration from public folder */}
            <div className="w-64 h-64 rounded-3xl overflow-hidden flex items-center justify-center">
              <img src="/empty-state.png" alt="Ready to level up?" className="w-full h-full object-contain" />
            </div>
          </motion.div>

          {/* Floating: AI Mentor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-1/3 right-0 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Zap size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">AI Mentor</p>
                <p className="text-xs text-emerald-500 font-medium">Active</p>
              </div>
            </div>
          </motion.div>

          {/* Floating: Problem Solver Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-4 left-4 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" />
              <div>
                <p className="text-xs font-semibold text-gray-700">Problem Solver</p>
                <p className="text-sm font-black text-gray-900">Level 12</p>
              </div>
            </div>
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
            { icon: "📚", title: "Curated Problems", desc: "Thousands of problems across all difficulty levels." },
            { icon: "🏆", title: "Compete & Grow", desc: "Join contests, climb leaderboards, win prizes." },
            { icon: "📊", title: "Build Consistency", desc: "Daily goals, streaks, and smart progress tracking." },
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

export default Signup;