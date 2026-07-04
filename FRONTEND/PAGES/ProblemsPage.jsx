import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../src/utils/axiosClient";
import { logoutUser } from "../src/authSlice";
import toast from "react-hot-toast";
import {
  ShieldAlert, LogOut, SlidersHorizontal, CheckCircle2,
  Circle, ChevronRight, Search, BarChart2, Zap, Trophy,
} from "lucide-react";

/* ── Difficulty badge ── */
const DiffBadge = ({ level }) => {
  const styles = {
    easy: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ring-1 ring-emerald-500/10",
    medium: "bg-amber-500/10  text-amber-400  border border-amber-500/20  ring-1 ring-amber-500/10",
    hard: "bg-rose-500/10   text-rose-400   border border-rose-500/20   ring-1 ring-rose-500/10",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${styles[level] || styles.easy}`}>
      {level}
    </span>
  );
};

/* ── Tag chip ── */
const TagChip = ({ tag }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[11px] font-semibold uppercase tracking-wide border border-zinc-700/60">
    {tag}
  </span>
);

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className={`flex items-center gap-3 bg-zinc-900 border rounded-xl px-5 py-4 ${accent}`}>
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent.includes("emerald") ? "bg-emerald-500/10 text-emerald-400" : accent.includes("amber") ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs text-zinc-500 font-medium">{label}</p>
      <p className="text-xl font-black text-white leading-tight">{value}</p>
    </div>
  </div>
);

/* ── Filter select ── */
const FilterSelect = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    className="bg-zinc-900 border border-zinc-700/60 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-emerald-500/40 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all appearance-none pr-8"
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
  >
    {children}
  </select>
);

function ProblemsPage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ difficulty: "all", tag: "all", status: "all" });

  const fetchProblems = async () => {
    try {
      const response = await axiosClient.get("/problem/getAllProblems");
      setProblems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setProblems([]);
    }
  };

  const fetchSolvedProblems = async () => {
    try {
      const { data } = await axiosClient.get("/problem/problemSolvedByUser");
      setSolvedProblems(data?.solvedProblems || []);
    } catch (error) {
      console.error("Error fetching solved problems:", error);
    }
  };

  useEffect(() => {
    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const filteredProblems = (problems || []).filter((problem) => {
    const difficultyMatch = filters?.difficulty === "all" || problem?.difficulty === filters?.difficulty;
    const tagMatch = filters?.tag === "all" || problem?.tags === filters?.tag;
    const statusMatch = filters?.status === "all" || solvedProblems?.some((sp) => sp?._id === problem?._id);
    const searchMatch = (problem?.title || "").toLowerCase().includes(search?.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  const solvedCount = solvedProblems?.length;
  const easyCount = (problems || []).filter(p => p.difficulty === "easy").length;
  const mediumCount = (problems || []).filter(p => p.difficulty === "medium").length;
  const hardCount = (problems || []).filter(p => p.difficulty === "hard").length;
  const solvedPct = (problems || []).length ? Math.round((solvedCount / (problems || []).length) * 100) : 0;

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
          <span className="text-xs font-mono font-medium text-zinc-400 tracking-wider uppercase group-hover:text-white transition-colors">
            Break it down to <span className="text-emerald-400 font-bold">0</span> and <span className="text-emerald-400 font-bold">1</span>s
          </span>
        </div>

        <div className="flex-none flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className="text-sm font-semibold text-zinc-300 hover:text-emerald-400 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-emerald-500/30 px-4 py-2 rounded-lg transition-all"
              >
                {user.userName || user.firstName}
              </NavLink>
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/adminPanel")}
                  className="text-sm text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <ShieldAlert size={14} />
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-zinc-400 hover:text-red-400 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-red-500/30 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-zinc-300 hover:text-emerald-400 font-semibold px-4 py-2 rounded-lg border border-zinc-700 transition-all text-sm">
                Login
              </NavLink>
              <NavLink to="/signup" className="bg-zinc-800 hover:bg-zinc-700 hover:text-emerald-400 text-white font-semibold px-5 py-2 rounded-lg border border-zinc-700 transition-all text-sm">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            Problem <span className="text-emerald-400">Explorer</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            Practice, solve, and master — one problem at a time.
          </p>
        </motion.div>


        {/* ── Filters + Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="bg-zinc-900/70 border border-zinc-800/60 rounded-xl px-6 py-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          {/* Search */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 placeholder-zinc-500 rounded-lg outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <SlidersHorizontal size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
            </div>
            <div className="w-px h-5 bg-zinc-800"></div>

            <FilterSelect value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
            </FilterSelect>

            <FilterSelect value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </FilterSelect>

            <FilterSelect value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })}>
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="string">String</option>
              <option value="dp">DP</option>
              <option value="graph">Graph</option>
            </FilterSelect>

            <span className="text-xs text-zinc-500 font-medium ml-1">
              {filteredProblems?.length} result{filteredProblems?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {/* ── Problem Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_130px_120px_40px] gap-0 px-6 py-3 bg-zinc-900 border-b border-zinc-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">#</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Title</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Difficulty</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tag</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-800/40">
            {filteredProblems?.map((problem, index) => {
              const isSolved = solvedProblems?.some((sp) => sp?._id === problem?._id);
              return (
                <motion.div
                  key={problem?._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="grid grid-cols-[40px_1fr_130px_120px_40px] gap-0 px-6 py-4 group hover:bg-zinc-800/30 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/problem/${problem?._id}`)}
                >
                  {/* # */}
                  <span className="text-sm text-zinc-600 font-mono self-center">{index + 1}</span>

                  {/* Title */}
                  <div className="flex items-center self-center">
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors leading-snug">
                      {problem?.title}
                    </span>
                  </div>

                  {/* Difficulty */}
                  <div className="self-center">
                    <DiffBadge level={problem?.difficulty} />
                  </div>

                  {/* Tag */}
                  <div className="self-center">
                    <TagChip tag={problem?.tags} />
                  </div>

                  {/* Status / Arrow */}
                  <div className="self-center flex justify-center">
                    {isSolved ? (
                      <CheckCircle2 size={17} className="text-emerald-400" />
                    ) : (
                      <ChevronRight size={17} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {filteredProblems?.length === 0 && (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-2">

                  <button
                    onClick={() => { setFilters({ difficulty: "all", tag: "all", status: "all" }); setSearch(""); }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="px-6 py-3 border-t border-zinc-800/60 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-xs text-zinc-600">
              Showing <span className="text-zinc-400 font-semibold">{filteredProblems?.length}</span> of{" "}
              <span className="text-zinc-400 font-semibold">{problems?.length}</span> problems
            </span>
            <span className="text-xs text-zinc-600">
              {solvedCount > 0 && (
                <span className="text-emerald-500 font-semibold">{solvedCount} solved</span>
              )}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProblemsPage;