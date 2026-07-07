import React from 'react';

const TestResults = ({ runResult, problem }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-sm font-bold mb-4 text-zinc-300 uppercase tracking-wider">Test Results</h3>
      {runResult ? (
        <div>
          {runResult.error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <h4 className="font-bold text-rose-400 flex items-center gap-2">❌ {runResult.message || 'Error running code'}</h4>
              {runResult.details && (
                <pre className="mt-3 bg-zinc-950 p-3 rounded-lg text-xs font-mono text-rose-300 whitespace-pre-wrap border border-rose-500/20">{runResult.details}</pre>
              )}
            </div>
          ) : Array.isArray(runResult) ? (
            <>
              {runResult.every(test => test.status === 'Accepted') ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 mb-4">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-2">✅ All Test Cases Passed</h4>
                  <p className="text-sm text-zinc-400 mt-1">{runResult.length} / {runResult.length} passed</p>
                </div>
              ) : (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 mb-4">
                  <h4 className="font-bold text-rose-400">❌ Some test cases failed</h4>
                  <p className="text-sm text-zinc-400 mt-1">{runResult.filter(t => t.status === 'Accepted').length} / {runResult.length} passed</p>
                </div>
              )}

              {/* Display each test case */}
              <div className="space-y-3">
                {runResult.map((test, index) => {
                  const visibleTest = problem?.visibleTestCase?.[index];

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${test.status === 'Accepted'
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-rose-500/30 bg-rose-500/5'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Test Case {index + 1}</h5>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${test.status === 'Accepted'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>{test.status}</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        {visibleTest && (
                          <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Input</div>
                            <pre className="font-mono text-zinc-300 text-xs whitespace-pre-wrap">{visibleTest.input}</pre>
                          </div>
                        )}
                        <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Expected Output</div>
                          <pre className="font-mono text-zinc-300 text-xs">{test.expected_output || '(empty)'}</pre>
                        </div>
                        <div className={`p-3 rounded-lg border ${test.status === 'Accepted' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
                          }`}>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Your Output</div>
                          <pre className="font-mono text-zinc-300 text-xs">{test.stdout || '(empty)'}</pre>
                        </div>
                        {test.stderr && (
                          <div className="bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">
                            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Error</div>
                            <pre className="font-mono text-xs text-rose-300 whitespace-pre-wrap">{test.stderr}</pre>
                          </div>
                        )}
                        {test.compile_output && (
                          <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Compilation Error</div>
                            <pre className="font-mono text-xs text-amber-300 whitespace-pre-wrap">{test.compile_output}</pre>
                          </div>
                        )}
                        {visibleTest?.explanation && (
                          <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Explanation</div>
                            <p className="text-xs text-zinc-300">{visibleTest.explanation}</p>
                          </div>
                        )}
                        <div className="flex gap-4 text-xs text-zinc-600">
                          {test.time && <span>⏱ {test.time}s</span>}
                          {test.memory && <span>💾 {test.memory}KB</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-amber-400 text-sm">Unexpected response format. Check console.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-zinc-500 text-sm">Click <strong className="text-zinc-400">Run</strong> to test your solution.</p>
        </div>
      )}
    </div>
  );
};

export default TestResults;
