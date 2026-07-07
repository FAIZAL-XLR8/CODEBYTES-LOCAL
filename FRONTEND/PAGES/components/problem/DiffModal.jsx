import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

const DiffModal = ({ showDiff, setShowDiff, diffOriginal, diffModified, selectedLanguage }) => {
  if (!showDiff) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h3 className="font-bold text-white text-lg">Compare Code Submission</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Left: Selected Past Submission | Right: Current Workspace Code</p>
          </div>
          <button
            onClick={() => setShowDiff(false)}
            className="btn btn-sm bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          >
            Close
          </button>
        </div>

        {/* Diff View Area */}
        <div className="flex-grow p-4 bg-zinc-950">
          <DiffEditor
            height="100%"
            language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'javascript' ? 'javascript' : selectedLanguage.toLowerCase()}
            theme="vs-dark"
            original={diffOriginal}
            modified={diffModified}
            options={{
              readOnly: true,
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              renderSideBySide: true,
              originalEditable: false
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default DiffModal;
