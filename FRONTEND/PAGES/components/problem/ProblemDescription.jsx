import React from 'react';

const ProblemDescription = ({ problem }) => {
  return (
    <div className="space-y-6">
      {problem ? (
        <>
          {/* Problem Title */}
          <div>
            <h1 className="text-xl font-bold text-white mb-3">{problem.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${problem.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  problem.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>{problem.difficulty}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs font-semibold uppercase border border-zinc-700">{problem.tags}</span>
            </div>
          </div>

          {/* Problem Description */}
          <div className="prose prose-invert max-w-none">
            <div
              className="text-zinc-300 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{ __html: problem.description || problem.problemStatement }}
            />
          </div>

          {/* Examples - using visibleTestCases */}
          {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2"><span className="w-1 h-4 bg-emerald-500 rounded-full inline-block"></span>Examples:</h3>
              {problem.visibleTestCases.map((example, index) => (
                <div key={index} className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-800">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Example {index + 1}</p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800/60">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Input</span>
                      <pre className="text-zinc-300 font-mono mt-1 text-xs whitespace-pre-wrap">{example.input}</pre>
                    </div>
                    <div className="bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800/60">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Output</span>
                      <pre className="text-zinc-300 font-mono mt-1 text-xs whitespace-pre-wrap">{example.output}</pre>
                    </div>
                    {example.explanation && (
                      <div className="bg-emerald-500/5 rounded-lg p-2.5 border border-emerald-500/20">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Explanation</span>
                        <p className="text-zinc-300 mt-1 text-xs">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!problem.visibleTestCases && problem.visibleTestCase && problem.visibleTestCase.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Test Cases:</h3>
              {problem.visibleTestCase.map((testCase, index) => (
                <div key={index} className="bg-[#282828] rounded-lg p-4 border border-[#3d3d3d]">
                  <p className="font-semibold text-white mb-3">Test Case {index + 1}:</p>
                  <div className="space-y-3">
                    <div className="bg-[#1e1e1e] p-3 rounded">
                      <div className="text-xs font-semibold text-gray-400 mb-1">INPUT</div>
                      <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{testCase.input}</pre>
                    </div>
                    <div className="bg-[#1e1e1e] p-3 rounded">
                      <div className="text-xs font-semibold text-gray-400 mb-1">EXPECTED OUTPUT</div>
                      <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{testCase.output}</pre>
                    </div>
                    {testCase.explanation && (
                      <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
                        <div className="text-xs font-semibold text-blue-400 mb-1">EXPLANATION</div>
                        <p className="text-sm text-gray-300">{testCase.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!problem.visibleTestCases && !problem.visibleTestCase && problem.examples && problem.examples.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Examples:</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-[#282828] rounded-lg p-4 border border-[#3d3d3d]">
                  <p className="font-semibold text-white mb-2">Example {index + 1}:</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">Input:</span> {example.input}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">Output:</span> {example.output}
                    </p>
                    {example.explanation && (
                      <p className="text-gray-300">
                        <span className="font-semibold text-white">Explanation:</span> {example.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {problem.constraints && problem.constraints.length > 0 && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2"><span className="w-1 h-4 bg-zinc-500 rounded-full inline-block"></span>Constraints:</h3>
              <ul className="space-y-1.5 text-zinc-400">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm"><span className="text-emerald-500 mt-0.5">•</span>{constraint}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </div>
  );
};

export default ProblemDescription;
