import React from 'react';

const Solutions = ({ problem }) => {
  return (
    <div className="py-6">
      {problem && problem.referenceSolution && problem.referenceSolution.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white">Reference Solutions</h3>
          </div>

          {problem.referenceSolution.map((solution, index) => (
            <div key={index} className="bg-[#282828] rounded-lg border border-[#3d3d3d] overflow-hidden">
              <div className="px-4 py-3 bg-[#1e1e1e] border-b border-[#3d3d3d] flex items-center justify-between">
                <span className="font-semibold text-white">{solution.language}</span>
                <button
                  onClick={async () => {
                    const textToCopy = solution.solutionCode;

                    try {
                      if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(textToCopy);
                      } else {
                        const textArea = document.createElement("textarea");
                        textArea.value = textToCopy;
                        textArea.style.position = "absolute";
                        textArea.style.left = "-999999px";
                        document.body.prepend(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        textArea.remove();
                      }

                      const toast = document.createElement('div');
                      toast.className = 'toast toast-top toast-center';
                      toast.innerHTML = `
        <div class="alert alert-success">
          <span>✓ Copied to clipboard!</span>
        </div>
      `;
                      document.body.appendChild(toast);
                      setTimeout(() => toast.remove(), 2000);

                    } catch (error) {
                      console.error(error);

                      // Error toast
                      const toast = document.createElement('div');
                      toast.className = 'toast toast-top toast-center';
                      toast.innerHTML = `
        <div class="alert alert-error">
          <span>✗ Failed to copy</span>
        </div>
      `;
                      document.body.appendChild(toast);
                      setTimeout(() => toast.remove(), 2000);
                    }
                  }}
                  className="btn btn-xs btn-ghost gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <div className="p-4">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{solution.solutionCode}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Solutions Available</h3>
            <p className="text-gray-400">
              Solutions for this problem haven't been added yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solutions;
