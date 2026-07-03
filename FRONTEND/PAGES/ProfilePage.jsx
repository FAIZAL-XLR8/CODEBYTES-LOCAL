import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion } from "framer-motion";
import axiosClient from "../src/utils/axiosClient";
import { User, Mail, Calendar, Shield, ArrowLeft, Award, Zap, Flame, Target, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

/* ── Animated progress bar ── */
const AnimatedBar = ({ value, color, delay = 0 }) => (
  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
      className={`h-full rounded-full ${color}`}
    />
  </div>
);

/* ── Difficulty stat row ── */
const DiffRow = ({ label, solved, total, color, barColor, delay }) => {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
        <span className="text-xs text-zinc-500 font-medium">{solved} / {total}</span>
      </div>
      <AnimatedBar value={pct} color={barColor} delay={delay + 0.2} />
    </motion.div>
  );
};

/* ── Info row ── */
const InfoRow = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center gap-3 py-3 border-b border-zinc-800/50 last:border-0"
  >
    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0">
      <Icon size={15} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-zinc-200">{value}</p>
    </div>
  </motion.div>
);

function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        setLoading(true);
        const profileRes = await axiosClient.get("/user/getProfile");
        setProfileData(profileRes.data.user);
        const problemsRes = await axiosClient.get("/problem/getAllProblems");
        setProblems(problemsRes.data);
        const solvedRes = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(solvedRes.data.solvedProblems || []);
      } catch (error) {
        console.error("Error loading profile details:", error);
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndStats();
  }, []);

  const getStats = () => {
    const solvedCounts = { easy: 0, medium: 0, hard: 0 };
    solvedProblems.forEach((p) => {
      if (p.difficulty === "easy") solvedCounts.easy++;
      else if (p.difficulty === "medium") solvedCounts.medium++;
      else if (p.difficulty === "hard") solvedCounts.hard++;
    });
    const totalCounts = { easy: 0, medium: 0, hard: 0 };
    (problems || []).forEach((p) => {
      if (p.difficulty === "easy") totalCounts.easy++;
      else if (p.difficulty === "medium") totalCounts.medium++;
      else if (p.difficulty === "hard") totalCounts.hard++;
    });
    return {
      total: solvedProblems.length,
      totalAll: problems.length,
      easy: solvedCounts.easy,
      medium: solvedCounts.medium,
      hard: solvedCounts.hard,
      totalEasy: totalCounts.easy,
      totalMedium: totalCounts.medium,
      totalHard: totalCounts.hard,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-emerald-500"></span>
          <p className="text-zinc-500 text-sm animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const overallPct = stats.totalAll > 0 ? Math.round((stats.total / stats.totalAll) * 100) : 0;
  const joinedDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "N/A";
  const fullName = `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim() || profileData?.username;
  const initials = (profileData?.firstName?.[0] || "U").toUpperCase();

  return (
    <div className="min-h-screen bg-[#080d18] text-zinc-100 font-sans">

      {/* ── Navbar ── */}
      <nav className="bg-[#0a0f1e]/90 backdrop-blur-md border-b border-zinc-800/50 px-6 sticky top-0 z-50 h-16 flex items-center relative">
        <div className="flex-1 flex items-center">
          <NavLink to="/" className="text-2xl font-black text-white tracking-tight hover:opacity-90 transition-opacity">
            Code<span className="text-emerald-400">Bytes</span><span className="text-emerald-400">.</span>
          </NavLink>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 group hover:border-emerald-500/40 transition-all cursor-default select-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-medium text-zinc-500 tracking-wider uppercase group-hover:text-zinc-300 transition-colors">
            Break it down to <span className="text-emerald-400 font-bold">0</span> and <span className="text-emerald-400 font-bold">1</span>s
          </span>
        </div>
        <div className="flex-none">
          <button
            onClick={() => navigate("/problems")}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-emerald-500/30 px-4 py-2 rounded-lg transition-all font-medium"
          >
            <ArrowLeft size={14} />
            Problems
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
            Your <span className="text-emerald-400">Profile</span>
          </h1>
          <p className="text-zinc-500 text-sm">Track your progress and coding journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT: Profile Card ── */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-900/70 border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden shadow-2xl"
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center text-center pb-6 border-b border-zinc-800/50"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl shadow-emerald-500/20">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white leading-tight">{fullName}</h2>
                <p className="text-sm text-zinc-500 mt-0.5">@{profileData?.username || profileData?.firstName?.toLowerCase() || "user"}</p>

                {profileData?.role === "admin" && (
                  <span className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield size={11} />
                    Admin
                  </span>
                )}
              </motion.div>

              {/* Info rows */}
              <div className="mt-4">
                <InfoRow icon={User} label="First Name" value={profileData?.firstName || "N/A"} delay={0.3} />
                {profileData?.lastName && (
                  <InfoRow icon={User} label="Last Name" value={profileData.lastName} delay={0.35} />
                )}
                <InfoRow icon={Mail} label="Email" value={profileData?.email || "N/A"} delay={0.4} />
                <InfoRow icon={Calendar} label="Joined" value={joinedDate} delay={0.45} />
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Stats ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Overall solved counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-zinc-900/70 border border-zinc-800/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Overall Progress</p>
                  <h2 className="text-3xl font-black text-white">
                    {stats.total}
                    <span className="text-lg text-zinc-600 font-medium"> / {stats.totalAll} solved</span>
                  </h2>
                </div>
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                >
                  <Target size={28} className="text-emerald-400" />
                </motion.div>
              </div>

              {/* Overall bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Completion</span>
                  <span className="text-emerald-400 font-bold">{overallPct}%</span>
                </div>
                <AnimatedBar value={overallPct} color="bg-gradient-to-r from-emerald-600 to-emerald-400" delay={0.4} />
              </div>
            </motion.div>

            {/* Difficulty breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-900/70 border border-zinc-800/60 rounded-2xl p-6 shadow-2xl"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-5">Difficulty Breakdown</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Easy", value: stats.easy, total: stats.totalEasy, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                  { label: "Medium", value: stats.medium, total: stats.totalMedium, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                  { label: "Hard", value: stats.hard, total: stats.totalHard, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
                ].map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                    className={`rounded-xl border ${d.border} ${d.bg} p-4 text-center`}
                  >
                    <p className={`text-3xl font-black ${d.color}`}>{d.value}</p>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">{d.label}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">of {d.total}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <DiffRow label="Easy"   solved={stats.easy}   total={stats.totalEasy}   color="text-emerald-400" barColor="bg-emerald-500"       delay={0.4} />
                <DiffRow label="Medium" solved={stats.medium} total={stats.totalMedium} color="text-amber-400"   barColor="bg-amber-500"         delay={0.5} />
                <DiffRow label="Hard"   solved={stats.hard}   total={stats.totalHard}   color="text-rose-400"   barColor="bg-rose-500"           delay={0.6} />
              </div>
            </motion.div>

            {/* Solved problems list */}
            {solvedProblems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-zinc-900/70 border border-zinc-800/60 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Solved Problems</p>
                  <span className="text-xs text-zinc-600">{solvedProblems.length} total</span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {solvedProblems.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.35 + i * 0.03 }}
                      className="flex items-center justify-between py-2.5 px-3 bg-zinc-800/40 rounded-xl border border-zinc-800/60 hover:border-emerald-500/20 hover:bg-zinc-800/60 transition-all group cursor-pointer"
                      onClick={() => navigate(`/problem/${p._id}`)}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-emerald-400 transition-colors">{p.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        p.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        p.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>{p.difficulty}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
