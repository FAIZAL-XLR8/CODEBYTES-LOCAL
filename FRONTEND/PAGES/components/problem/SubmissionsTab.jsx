import React from 'react';
import toast from 'react-hot-toast';

const SubmissionsTab = ({
  submissions,
  loadingSubmissions,
  expandedSubmissionId,
  setExpandedSubmissionId,
  handleAnalyzeCode,
  setDiffOriginal,
  setDiffModified,
  setShowDiff,
  getCurrentCode,
  code,
  copyToClipboard,
}) => {
  return (
    <div className="py-6">
      {loadingSubmissions ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : submissions && submissions.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Language</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Runtime</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Memory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {(Array.isArray(submissions) ? submissions : []).map((submission) => {
                const isAccepted = submission.status === 'accepted';
                const isWrong = submission.status === 'wrong';
                const isError = submission.status === 'error';

                const statusText = isAccepted ? 'Accepted' :
                  isWrong ? 'Wrong Answer' :
                    isError ? 'Runtime Error' : 'Time Limit Exceeded';

                const statusColor = isAccepted ? 'text-emerald-400' : 'text-red-400';

                const formattedDate = new Date(submission.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                // Format runtime in milliseconds
                let runtimeStr = 'N/A';
                if (isAccepted && submission.runtime) {
                  const rtVal = parseFloat(submission.runtime);
                  runtimeStr = rtVal < 1
                    ? Math.round(rtVal * 1000) + ' ms'
                    : rtVal.toFixed(1) + ' s';
                }

                // Format memory in Megabytes
                let memoryStr = 'N/A';
                if (isAccepted && submission.memory) {
                  const memVal = parseFloat(submission.memory);
                  memoryStr = memVal > 1024
                    ? (memVal / 1024).toFixed(1) + ' MB'
                    : memVal.toFixed(1) + ' KB';
                }

                const isExpanded = expandedSubmissionId === submission._id;

                return (
                  <React.Fragment key={submission._id}>
                    <tr
                      onClick={() => setExpandedSubmissionId(isExpanded ? null : submission._id)}
                      className="group hover:bg-zinc-800/40 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${statusColor} group-hover:underline`}>
                            {statusText}
                          </span>
                          <span className="text-[11px] text-zinc-500 mt-0.5">
                            {formattedDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700 uppercase">
                          {submission.language}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-300">
                        {isAccepted ? (
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {runtimeStr}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-300">
                        {isAccepted ? (
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            {memoryStr}
                          </span>
                        ) : 'N/A'}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-zinc-950/30">
                        <td colSpan="4" className="p-0 border-none">
                          <div className="p-5 bg-zinc-950/80 border-t border-b border-zinc-800">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Submitted Code</span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnalyzeCode(submission.code);
                                  }}
                                  className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 border-none text-white font-medium shadow-sm transition-all"
                                >
                                  Analyze with AI
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDiffOriginal(submission.code);
                                    setDiffModified(getCurrentCode() || code);
                                    setShowDiff(true);
                                  }}
                                  className="btn btn-xs bg-indigo-650 hover:bg-indigo-700 border-none text-white font-medium shadow-sm transition-all"
                                >
                                  Compare with Current
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(submission.code);
                                    toast.success("Code copied to clipboard!");
                                  }}
                                  className="btn btn-xs bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
                                >
                                  Copy Code
                                </button>
                                {submission.errorMessage && (
                                  <span className="text-xs text-red-400 font-medium self-center bg-red-950/30 px-2 py-0.5 rounded border border-red-500/20">
                                    Error: {submission.errorMessage}
                                  </span>
                                )}
                              </div>
                            </div>
                            <pre className="p-4 bg-zinc-900 border border-zinc-850 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed shadow-inner">
                              <code>{submission.code}</code>
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-zinc-500">No submissions yet. Submit your solution to see it here!</p>
        </div>
      )}
    </div>
  );
};

export default SubmissionsTab;
