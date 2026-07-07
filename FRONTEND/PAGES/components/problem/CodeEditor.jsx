import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({
  code,
  setCode,
  selectedLangOption,
  handleEditorDidMount,
  handleResetCode,
  handleRunCode,
  handleSubmitCode,
  loading,
  handleSuggestCode,
  loadingSuggest,
  suggestionData,
  setSuggestionData,
  acceptSuggestion,
}) => {
  return (
    <>
      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={selectedLangOption?.monacoLang || 'javascript'}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            lineNumbers: 'on',
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            fontSize: 14,
            minimap: {
              enabled: true,
              scale: 3,             // Maximum allowed scale (1-3)
              maxColumn: 80,        // Fit more columns in the minimap width
              showSlider: 'always'
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            // Point 1 - Advanced Editor Features
            bracketPairColorization: { enabled: true },
            stickyScroll: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            occurrencesHighlight: 'singleFile',
            quickSuggestionsDelay: 0,
          }}
        />

        {/* AI Suggestion Preview Overlay Modal */}
        {suggestionData && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e1e24] border border-[#3a3b45] rounded-xl w-full max-w-md p-5 shadow-2xl flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#32333d] pb-2.5">
                <h4 className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 .364l-.707 .707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Suggestion (Next 4 Lines)
                </h4>
                <button
                  onClick={() => setSuggestionData(null)}
                  className="text-zinc-500 hover:text-zinc-300 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Rationale Section */}
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 text-xs text-amber-200/90 leading-relaxed font-sans flex flex-col gap-1 shadow-inner">
                <p>💡 {suggestionData.rationaleLine1}</p>
                <p>🔍 {suggestionData.rationaleLine2}</p>
              </div>

              {/* Code Preview Section */}
              <div className="relative">
                <div className="absolute top-2.5 left-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider select-none">Preview:</div>
                <pre className="p-4 pt-7 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-40 shadow-inner">
                  <code>{suggestionData.codeToInject}</code>
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#32333d]">
                <button
                  onClick={() => setSuggestionData(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 bg-zinc-850 hover:bg-zinc-800 hover:text-white rounded-lg transition-all"
                >
                  Dismiss
                </button>
                <button
                  onClick={acceptSuggestion}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/20 transition-all"
                >
                  Accept & Inject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f1a] border-t border-zinc-800/60">
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={handleSuggestCode}
            disabled={loadingSuggest || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-white bg-amber-955/20 hover:bg-amber-900/35 border border-amber-900/40 rounded-lg transition-all disabled:opacity-50"
          >
            {loadingSuggest ? (
              <span className="loading loading-spinner loading-xs text-amber-400"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 .364l-.707 .707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
            Suggest Code
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Run
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
