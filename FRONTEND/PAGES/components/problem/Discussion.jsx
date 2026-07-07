import React from 'react';

const Discussion = ({
  comments,
  loadingComments,
  newComment,
  setNewComment,
  submittingComment,
  handlePostComment,
  fetchComments,
  hoveredUserStats,
  loadingHoverStats,
  statsTooltipUserId,
  setStatsTooltipUserId,
  handleFetchUserStats,
}) => {
  return (
    <div className="py-6 space-y-6">
      <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Discussion Forum</h3>
        <button
          onClick={fetchComments}
          className="btn btn-xs bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
        >
          Refresh Comments
        </button>
      </div>

      {/* Comment Box Form */}
      <form onSubmit={handlePostComment} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-3">
        <textarea
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask a question or share your approach..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder-zinc-600 resize-none"
          maxLength="500"
        />
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <span>{newComment.length}/500</span>
          <button
            type="submit"
            disabled={submittingComment || !newComment.trim()}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {submittingComment ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loadingComments ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700/60 transition-colors duration-150"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  {/* Avatar Circle */}
                  <div className="w-8 h-8 rounded-full bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    {/* Relative Profile Solved-Stats Popup Tooltip */}
                    <div className="relative inline-block">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (statsTooltipUserId === comment._id) {
                            setStatsTooltipUserId(null);
                          } else {
                            setStatsTooltipUserId(comment._id);
                            handleFetchUserStats(comment.userId);
                          }
                        }}
                        className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer text-sm"
                      >
                        {comment.userName}
                      </span>

                      {statsTooltipUserId === comment._id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-0 bottom-full mb-3.5 z-[100] w-64 p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl text-left animate-fade-in"
                        >
                          <div className="flex justify-between items-start mb-3 border-b border-zinc-850 pb-2">
                            <div>
                              <h4 className="font-bold text-white text-sm">@{hoveredUserStats?.userName || 'User'}</h4>
                              <p className="text-[10px] text-zinc-500 mt-0.5 font-medium tracking-wide uppercase">Stats Gauge</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatsTooltipUserId(null);
                              }}
                              className="text-zinc-500 hover:text-zinc-350 text-xs font-bold bg-zinc-850 hover:bg-zinc-800 h-5 w-5 rounded-full flex items-center justify-center transition-colors"
                            >
                              ✕
                            </button>
                          </div>

                          {loadingHoverStats ? (
                            <div className="flex justify-center py-4">
                              <span className="loading loading-spinner loading-sm text-indigo-500"></span>
                            </div>
                          ) : hoveredUserStats ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>Total Solved:</span>
                                <span className="font-extrabold text-white text-sm">{hoveredUserStats.total}</span>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between text-[10px] mb-1 font-semibold uppercase tracking-wider">
                                    <span className="text-emerald-400">Easy</span>
                                    <span className="text-zinc-400">{hoveredUserStats.easy}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500"
                                      style={{ width: `${hoveredUserStats.total > 0 ? (hoveredUserStats.easy / hoveredUserStats.total) * 100 : 0}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[10px] mb-1 font-semibold uppercase tracking-wider">
                                    <span className="text-amber-400">Medium</span>
                                    <span className="text-zinc-400">{hoveredUserStats.medium}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-amber-500"
                                      style={{ width: `${hoveredUserStats.total > 0 ? (hoveredUserStats.medium / hoveredUserStats.total) * 100 : 0}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[10px] mb-1 font-semibold uppercase tracking-wider">
                                    <span className="text-rose-400">Hard</span>
                                    <span className="text-zinc-400">{hoveredUserStats.hard}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-rose-500"
                                      style={{ width: `${hoveredUserStats.total > 0 ? (hoveredUserStats.hard / hoveredUserStats.total) * 100 : 0}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-500">Failed to load stats</p>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-300 pl-10 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-zinc-750" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-zinc-500">No discussion comments yet. Be the first to ask or answer!</p>
        </div>
      )}
    </div>
  );
};

export default Discussion;
