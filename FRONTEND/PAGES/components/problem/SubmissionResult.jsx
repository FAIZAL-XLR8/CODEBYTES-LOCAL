import React from 'react';

const SubmissionResult = ({ submitResult }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-sm font-bold mb-4 text-zinc-300 uppercase tracking-wider">Submission Result</h3>
      {submitResult ? (
        <div>
          {submitResult.accepted === true || submitResult.status === 'accepted' ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
              <h4 className="font-black text-2xl text-emerald-400 mb-1">Accepted</h4>
              <p className="text-zinc-500 text-sm mb-4">Your solution passed all test cases.</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Passed</p>
                  <p className="text-lg font-black text-white">{submitResult.testCasesPassed || submitResult.passedTestCases}/{submitResult.testCasesTotal || submitResult.totalTestCases}</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Runtime</p>
                  <p className="text-lg font-black text-white">{submitResult.runtime ? parseFloat(submitResult.runtime).toFixed(4) : 'N/A'}s</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Memory</p>
                  <p className="text-lg font-black text-white">{submitResult.memory ? parseFloat(submitResult.memory).toFixed(4) : 'N/A'}KB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-6">
              <h4 className="font-black text-xl text-rose-400 mb-1">
                ❌ {submitResult.status === 'wrong' ? 'Wrong Answer' :
                  submitResult.status === 'error' ? 'Runtime Error' :
                    submitResult.errorMessage || submitResult.error || 'Submission Failed'}
              </h4>
              <p className="text-zinc-500 text-sm mb-4">Test Cases Passed: <span className="text-white font-bold">{submitResult.testCasesPassed || submitResult.passedTestCases || 0}/{submitResult.testCasesTotal || submitResult.totalTestCases || 0}</span></p>
              {submitResult.details && (
                <pre className="bg-zinc-950 p-3 rounded-lg text-xs font-mono text-rose-300 whitespace-pre-wrap border border-rose-500/20">{submitResult.details}</pre>
              )}
              {submitResult.errorMessage && (
                <pre className="bg-zinc-950 p-3 rounded-lg text-xs font-mono text-rose-300 whitespace-pre-wrap border border-rose-500/20 mt-2">{submitResult.errorMessage}</pre>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-zinc-500 text-sm">Click <strong className="text-zinc-400">Submit</strong> to evaluate your solution.</p>
        </div>
      )}
    </div>
  );
};

export default SubmissionResult;
