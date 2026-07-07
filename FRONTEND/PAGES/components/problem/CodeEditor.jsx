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
}) => {
  return (
    <>
      {/* Monaco Editor */}
      <div className="flex-1">
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
