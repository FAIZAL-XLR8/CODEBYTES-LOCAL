import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../src/utils/axiosClient";
import { logoutUser } from "../src/authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const { user,isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

//fetch problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/getAllProblems"
        );
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/problemSolvedByUser"
        );
        setSolvedProblems(data.solvedProblems);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  //logout
  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); //set to empty after logging out for different user
    alert("User logged out!")
  };

  
  const filteredProblems = (problems||[]).filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty === filters.difficulty;

    const tagMatch =
      filters.tag === "all" || problem.tags === filters.tag;

    const statusMatch =
      filters.status === "all" ||
      solvedProblems.some(
        (sp) => sp._id === problem._id
      );

    return difficultyMatch && tagMatch && statusMatch;
  });
  const handleClick = () => {
    navigate ("/adminPanel");
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-base-300 via-base-200 to-base-300">
   {/* navgiation bar */}
    <nav className="navbar bg-base-100/95 backdrop-blur-md shadow-2xl px-6 sticky top-0 z-50 border-b border-base-300">
  <div className="flex-1">
    <NavLink to="/" className="text-2xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform">
      CodeBytes
    </NavLink>
  </div>
  <div className="flex-none">
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        <>
          <div className="badge badge-lg badge-ghost font-semibold px-4 py-3">
          
            {user.userName
            }
          </div>
          {user?.role === "admin" && (
            <button 
              onClick={handleClick}
              className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-error btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className="btn btn-sm btn-ghost gap-2 hover:bg-base-200 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </NavLink>
          <NavLink to="/signup" className="btn btn-sm btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Signup
          </NavLink>
        </>
      )}
    </div>
  </div>
</nav>

      {/*FILTERS  */}
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="card bg-base-100 shadow-2xl mb-8 border border-base-300">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Problems
            </h2>
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="form-control w-full sm:w-auto">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered select-primary w-full sm:w-48 font-medium shadow-md hover:shadow-lg transition-shadow"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="all">All Problems</option>
                  <option value="solved">Solved Problems</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="form-control w-full sm:w-auto">
                <label className="label">
                  <span className="label-text font-semibold">Difficulty</span>
                </label>
                <select
                  className="select select-bordered select-primary w-full sm:w-48 font-medium shadow-md hover:shadow-lg transition-shadow"
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      difficulty: e.target.value,
                    })
                  }
                >
                  <option value="all">All Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Tag Filter */}
              <div className="form-control w-full sm:w-auto">
                <label className="label">
                  <span className="label-text font-semibold">Tag</span>
                </label>
                <select
                  className="select select-bordered select-primary w-full sm:w-48 font-medium shadow-md hover:shadow-lg transition-shadow"
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters({ ...filters, tag: e.target.value })
                  }
                >
                  <option value="all">All Tags</option>
                  <option value="array">Array</option>
                  <option value="string">String</option>
                  <option value="dp">DP</option>
                  <option value="graph">Graph</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* PROBLEM LIST  */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                  <tr className="border-b-2 border-base-300">
                    <th className="text-base font-bold">Status</th>
                    <th className="text-base font-bold">Title</th>
                    <th className="text-base font-bold">Difficulty</th>
                    <th className="text-base font-bold">Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem) => {
                    const isSolved = solvedProblems.some(
                      (sp) => sp._id === problem._id
                    );

                    return (
                      <tr key={problem._id} className="hover:bg-base-200/50 transition-colors duration-200">
                        <td>
                          <div className={`badge ${isSolved ? 'badge-success' : 'badge-ghost'} gap-2 font-semibold px-4 py-3`}>
                            {isSolved ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Solved
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Unsolved
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="link link-primary font-semibold text-base hover:text-primary-focus transition-colors duration-200 hover:underline-offset-4"
                          >
                            {problem.title}
                          </NavLink>
                        </td>
                        <td>
                          <span className={`badge font-semibold px-4 py-3 ${
                            problem.difficulty === 'easy' 
                              ? 'badge-success' 
                              : problem.difficulty === 'medium' 
                              ? 'badge-warning' 
                              : 'badge-error'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-outline badge-primary font-medium px-4 py-3">
                            {problem.tags}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;