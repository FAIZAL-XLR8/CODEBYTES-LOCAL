import React from 'react';
import { renderMessageContent } from '../../chatAi';

const AIAnalyser = ({ aiAnalysis, analyzing, handleAnalyzeCode, getCurrentCode, code }) => {
  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-xl font-semibold text-white">AI Analysis & Feedback</h3>
        <button
          onClick={() => handleAnalyzeCode(getCurrentCode() || code)}
          className="btn btn-xs bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-zinc-300"
        >
          Analyze Current Code
        </button>
      </div>

      {analyzing ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="loading loading-spinner loading-lg text-emerald-500"></span>
          <p className="text-sm text-zinc-400 animate-pulse font-medium">AI is analyzing your code details...</p>
        </div>
      ) : aiAnalysis ? (
        <div className="bg-[#1e1e1e] border border-zinc-800 rounded-xl p-5 shadow-inner">
          <div className="space-y-1">
            {renderMessageContent(aiAnalysis)}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-900/20 rounded-xl border border-zinc-850 p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 .364l-.707 .707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h4 className="text-white font-semibold text-base mb-1">No Analysis Done Yet</h4>
          <p className="text-zinc-500 text-sm max-w-md mx-auto mb-4">
            Get instant professional feedback on your complexity, code quality, edge cases, and optimizations.
          </p>
          <button
            onClick={() => handleAnalyzeCode(getCurrentCode() || code)}
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 border-none text-white font-medium px-4 shadow-md"
          >
            Analyze Current Workspace Code
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAnalyser;
