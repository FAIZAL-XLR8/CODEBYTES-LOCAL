import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { Link } from 'react-router';
import { useParams } from 'react-router';
import axiosClient from '../src/utils/axiosClient';
import AIChatAssistant from "./chatAi"
import { useDispatch, useSelector } from 'react-redux'; 
import {saveCode, selectCode, clearLanguageCode, clearProblemCode,  markProblemInitialized,  selectIsInitialized}from '../src/utils/codeSlice';
import Editorial from "./Editorial"
const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const editorRef = useRef(null);
  const { problemId } = useParams();
  const dispatch = useDispatch();
  // Get from Redux
  const savedCodeForLanguage = useSelector(state => 
    selectCode(state, problemId, selectedLanguage)
  );
  const isInitialized = useSelector(state =>
    selectIsInitialized(state, problemId, selectedLanguage)
  );

  const { handleSubmit } = useForm();
// copy from clipboard
async function copyToClipboard(textToCopy) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    }
}
  /* FETCH PREVIOUS SUBMISSIONS */
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const response = await axiosClient.get(`/submission/submissions/${problemId}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  /* FETCH SUBMISSIONS WHEN TAB CHANGES */
  useEffect(() => {
    if (activeLeftTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeLeftTab]);

  /* FETCH PROBLEM DATA */
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(response.data);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  /* ✅ INITIALIZE CODE - Runs once per problem+language combination */
  useEffect(() => {
    // Don't run until problem is loaded
    if (!problem) {
      console.log('⏸️ Waiting for problem data...');
      return;
    }

    // If already initialized, just load the saved code
    if (isInitialized) {
      console.log(`✅ Already initialized: ${problemId}-${selectedLanguage}`);
      if (savedCodeForLanguage) {
        
        setCode(savedCodeForLanguage);
      } else {
        console.log(` Initialized but no saved code - this shouldn't happen`);
      }
      return;
    }

    // First time initialization for this problem+language
    
    
     
      // No saved code - load boilerplate
     
      updateInitialCode(problem, selectedLanguage);
    
    
    // Mark as initialized
    
    dispatch(markProblemInitialized({
      problemId,
      language: selectedLanguage
    }));
    
  }, [problem, problemId, selectedLanguage, isInitialized]);

  /* ✅ AUTO-SAVE - Only runs after initialization */
  useEffect(() => {
    // Only save if:
    // 1. Code exists
    // 2. Problem is initialized (prevents saving initial boilerplate immediately)
    if (!code || !isInitialized) {
      console.log(`⏸️ Skipping auto-save (code: ${!!code}, init: ${isInitialized})`);
      return;
      //above says
      // “Don’t save if code is empty”
// “Don’t save if this problem+language isn’t fully initialized yet”
    }

    const timeoutId = setTimeout(() => {
      console.log(`💾 Auto-saving ${selectedLanguage} code (${code.length} chars)`);
      dispatch(saveCode({
        problemId,
        language: selectedLanguage,
        code
      }));
    }, 1000);
    /*
    This means:

User types → effect runs

Timer starts

If user types again within 1 sec → effect runs again

Old timer is cancelled

New timer starts

👉 Save happens only when user pauses typing for 1 second

This is called debouncing.
*/
    return () => clearTimeout(timeoutId);
  }, [code, problemId, selectedLanguage, isInitialized, dispatch]);

  /* UPDATE INITIAL CODE FUNCTION */
  const updateInitialCode = (problemData, language) => {
    const startCodeArray = problemData?.startCode;
    
    if (!startCodeArray || startCodeArray.length === 0) {
      console.log('No startCode found, using default');
      setCode(getDefaultCode(language));
      return;
    }

    const languageMap = {
      'cpp': 'C++',
      'java': 'Java', 
      'javascript': 'JavaScript'  
    };

    const backendLanguage = languageMap[language];
    const initialCode = startCodeArray.find(
      (sc) => sc.language === backendLanguage
    );

    if (initialCode?.boilerCode) {
      console.log(`📝 Found boilerplate for ${language}`);
      setCode(initialCode.boilerCode);
    } else {
      console.log(`📝 No boilerplate found, using default for ${language}`);
      setCode(getDefaultCode(language));
    }
  };

  /* DEFAULT CODE FOR EACH LANGUAGE */
  const getDefaultCode = (language) => {
    const defaults = {
      'javascript': "const readline = require('readline');\n\n// Complete input handling here",
      'java': "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Read input and print sum\n  }\n}",
      'cpp': "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  // Read input and print sum\n}"
    };
    return defaults[language] || '// Write your code here';
  };
  /* HANDLE LANGUAGE CHANGE */
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;   
    // Save current code before switching (if initialized)
    if (code && isInitialized) {
      console.log(`💾 Saving ${selectedLanguage} code before switch`);
      dispatch(saveCode({
        problemId,
        language: selectedLanguage,
        code
      }));
    }
    
    setSelectedLanguage(newLanguage);
  };
  /* HANDLE EDITOR MOUNT */
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    console.log('✅ Editor mounted');
  };
  const getCurrentCode = () => {
    return editorRef.current?.getValue();
  };
  /* RESET CODE */
  const handleResetCode = () => {
    if (problem) {
      console.log(`🔄 Resetting ${selectedLanguage} code to boilerplate`);
      updateInitialCode(problem, selectedLanguage);
      
      // Clear from Redux
      dispatch(clearLanguageCode({
        problemId,
        language: selectedLanguage
      }));
    }
  };
  /* RUN CODE */
  const handleRunCode = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const languageMap = {
        'cpp': 'C++',
        'java': 'Java',
        'javascript': 'Javascript'  
      };
      
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: code,
        language: languageMap[selectedLanguage] || selectedLanguage,
      });

      setRunResult(response.data); 
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        error: true,
        message: error.response?.data?.error || error.response?.data?.message || 'Error running code',
        details: error.response?.data?.details || error.message
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };
  /* SUBMIT CODE */
  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const languageMap = {
        'cpp': 'C++',
        'java': 'Java',
        'javascript': 'Javascript' 
      };
      
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: languageMap[selectedLanguage] || selectedLanguage,
      });

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        accepted: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Error submitting code',
        details: error.response?.data?.details || error.message,
        passedTestCases: error.response?.data?.passedTestCases || 0,
        totalTestCases: error.response?.data?.totalTestCases || 0
      });
      setLoading(false);
      setActiveRightTab('result');
    }
  };
  /* LANGUAGE OPTIONS */
  const languageOptions = [
    { value: 'cpp', label: 'C++', monacoLang: 'cpp' },
    { value: 'java', label: 'Java', monacoLang: 'java' },
    { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
  ];
  const selectedLangOption = languageOptions.find((opt) => opt.value === selectedLanguage);
  if (loading && !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a1a1a]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-gray-100">
      {/*  TOP NAVBAR */}
      <nav className="flex items-center justify-between px-4 py-2 bg-[#282828] border-b border-[#3d3d3d] shadow-lg">
        <div className="flex items-center gap-4">
          <Link to ="/" className="text-xl font-bold text-white hover:text-primary transition-colors">
            CodeBytes
          </Link>
          <div className="text-gray-400">|</div>
          <h2 className="text-base font-semibold text-gray-300">
            {problem?.title || 'Loading...'}
          </h2>
        </div>
        <div className="flex items-center gap-3">
         
        </div>
      </nav>

      {/*  MAIN SPLIT VIEW  */}
      <div className="flex flex-1 overflow-hidden">
        {/*  LEFT PANEL (PROBLEM KA  DESCRIPTION)  */}
        <div className="w-1/2 flex flex-col border-r border-[#3d3d3d] bg-[#1e1e1e]">
          {/* Left Tabs */}
          <div className="flex border-b border-[#3d3d3d] bg-[#252525]">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeLeftTab === 'description'
                  ? 'text-white border-b-2 border-primary bg-[#2d2d2d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Description
            </button>
             <button
              onClick={() => setActiveLeftTab('editorial')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeLeftTab === 'editorial'
                  ? 'text-white border-b-2 border-primary bg-[#2d2d2d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Editorial
            </button>
            <button
              onClick={() => setActiveLeftTab('solutions')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeLeftTab === 'solutions'
                  ? 'text-white border-b-2 border-primary bg-[#2d2d2d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Solutions
            </button>
            <button
              onClick={() => setActiveLeftTab('submissions')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeLeftTab === 'submissions'
                  ? 'text-white border-b-2 border-primary bg-[#2d2d2d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Submissions
            </button>
          </div>
                
          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeLeftTab === 'description' && (
              <div className="space-y-6">
                {problem ? (
                  <>
                    {/* Problem Title */}
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
                      <div className="flex items-center gap-3">
                        <span
                          className={`badge font-semibold px-3 py-2 ${
                            problem.difficulty === 'easy'
                              ? 'badge-success'
                              : problem.difficulty === 'medium'
                              ? 'badge-warning'
                              : 'badge-error'
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                        <span className="badge badge-outline badge-primary px-3 py-2">{problem.tags}</span>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div className="prose prose-invert max-w-none">
                      <div
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: problem.description || problem.problemStatement }}
                      />
                    </div>

                    {/* Examples - using visibleTestCases */}
                    {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Examples:</h3>
                        {problem.visibleTestCases.map((example, index) => (
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
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Constraints:</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                          {problem.constraints.map((constraint, index) => (
                            <li key={index}>{constraint}</li>
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
            )}
             {activeLeftTab === 'editorial' && (
  <div className="prose max-w-none">
    <h2 className="text-xl font-bold mb-4">Editorial</h2>
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
     <Editorial secureUrl={problem.secureUrl} duration={problem.duration}></Editorial>
    </div>
  </div>
)}

            {activeLeftTab === 'solutions' && (
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-white mb-2">Solutions Locked</h3>
                      <p className="text-gray-400">
                        Solutions will be available after you successfully solve this problem. Keep trying!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === 'submissions' && (
              <div className="py-6">
                {loadingSubmissions ? (
                  <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Your Submissions</h3>
                    {submissions.map((submission, index) => (
                      <div 
                        key={submission._id} 
                        className="bg-[#282828] rounded-lg border border-[#3d3d3d] overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-[#1e1e1e] border-b border-[#3d3d3d] flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`badge ${
                              submission.status === 'accepted' ? 'badge-success' : 
                              submission.status === 'wrong' ? 'badge-error' :
                              submission.status === 'error' ? 'badge-error' :
                              'badge-warning'
                            }`}>
                              {submission.status === 'accepted' ? '✅ Accepted' : 
                               submission.status === 'wrong' ? '❌ Wrong Answer' :
                               submission.status === 'error' ? '❌ Error' :
                               '⏳ ' + submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-400">{submission.language}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(submission.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex gap-4 mb-3 text-sm">
                            <div className="text-gray-300">
                              <strong>Test Cases:</strong> {submission.testCasesPassed}/{submission.testCasesTotal}
                            </div>
                            {submission.runtime && (
                              <div className="text-gray-300">
                                <strong>Runtime:</strong> {submission.runtime}s
                              </div>
                            )}
                            {submission.memory && (
                              <div className="text-gray-300">
                                <strong>Memory:</strong> {submission.memory}KB
                              </div>
                            )}
                          </div>
                          
                          {submission.errorMessage && (
                            <div className="mb-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-400">
                              <strong>Error:</strong> {submission.errorMessage}
                            </div>
                          )}
                          
                          <details className="cursor-pointer">
                            <summary className="text-sm text-primary hover:text-primary-focus">
                              View Code
                            </summary>
                            <pre className="mt-2 p-3 bg-[#1e1e1e] rounded text-sm text-gray-300 overflow-x-auto">
                              <code>{submission.code}</code>
                            </pre>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400">No submissions yet. Submit your solution to see it here!</p>
                  </div>
                )}
              </div>
            )}
          
          </div>
        </div>

        {/*  RIGHT PANEL (CODE EDITOR) */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          {/* Right Tabs + Language Selector */}
          <div className="flex items-center justify-between border-b border-[#3d3d3d] bg-[#252525]">
            <div className="flex">
              <button
                onClick={() => setActiveRightTab('code')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeRightTab === 'code'
                    ? 'text-white border-b-2 border-primary bg-[#2d2d2d]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveRightTab('testcase')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeRightTab === 'testcase'
                    ? 'text-white border-b-2 border-primary bg-[#2d2d2d]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Test Results
              </button>
              <button
                onClick={() => setActiveRightTab('result')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeRightTab === 'result'
                    ? 'text-white border-b-2 border-primary bg-[#2d2d2d]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Submission Result
              </button>
            </div>

            {activeRightTab === 'code' && (
              <div className="px-4">
                <select
                  className="select select-sm select-bordered bg-[#2d2d2d] text-gray-300 border-[#3d3d3d] focus:border-primary"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeRightTab === 'code' && (
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
                    lineNumbers : 'on',
                    lineDecorationsWidth : 10,
                    lineNumbersMinChars : 3,
                    renderLineHighlight : 'line',
                    selectOnLineNumbers : true,
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#252525] border-t border-[#3d3d3d]">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleResetCode}
                      className="btn btn-sm btn-ghost text-gray-400 hover:text-white gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunCode}
                      disabled={loading}
                      className="btn btn-sm btn-ghost text-gray-300 hover:text-white hover:bg-[#3d3d3d] gap-2"
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      Run
                    </button>
                    <button
                      onClick={handleSubmitCode}
                      disabled={loading}
                      className="btn btn-sm btn-success gap-2 hover:btn-success"
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-lg font-semibold mb-4 text-white">Test Results</h3>
                {runResult ? (
                  <div>
                   
                    {runResult.error ? (
                      <div className="alert alert-error">
                        <div className="w-full">
                          <h4 className="font-bold text-lg">❌ {runResult.message || 'Error running code'}</h4>
                          {runResult.details && (
                            <div className="mt-3 bg-base-100 p-3 rounded">
                              <p className="text-sm font-mono text-gray-300">{runResult.details}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : Array.isArray(runResult) ? (
                      
                      <>
                        {/* Check if all tests passed */}
                        {runResult.every(test => test.status === 'Accepted') ? (
                          <div className="alert alert-success mb-4">
                            <div className="w-full">
                              <h4 className="font-bold text-lg">✅ All Test Cases Passed</h4>
                              <div className="mt-4 space-y-2">
                                <p className="text-sm">
                                  Test cases: <strong>{runResult.length}</strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="alert alert-error mb-4">
                            <div className="w-full">
                              <h4 className="font-bold text-lg">❌ Some test cases failed</h4>
                            </div>
                          </div>
                        )}

                        {/* Display each test case */}
                        <div className="space-y-3">
                          {runResult.map((test, index) => {
                          
                            const visibleTest = problem?.visibleTestCase?.[index];
                            
                            return (
                              <div 
                                key={index} 
                                className={`p-4 rounded-lg border ${
                                  test.status === 'Accepted' 
                                    ? 'border-green-500 bg-green-900/20' 
                                    : 'border-red-500 bg-red-900/20'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-semibold text-white">Test Case {index + 1}</h5>
                                  <span className={`badge ${
                                    test.status === 'Accepted' ? 'badge-success' : 'badge-error'
                                  }`}>
                                    {test.status}
                                  </span>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  {/* Show input from visible test case */}
                                  {visibleTest && (
                                    <div className="bg-[#1e1e1e] p-3 rounded">
                                      <div className="font-semibold text-gray-400 mb-1">Input:</div>
                                      <div className="font-mono text-gray-300">{visibleTest.input}</div>
                                    </div>
                                  )}
                                  
                                  {/* Show expected output */}
                                  <div className="bg-[#1e1e1e] p-3 rounded">
                                    <div className="font-semibold text-gray-400 mb-1">Expected Output:</div>
                                    <div className="font-mono text-gray-300">{test.expected_output || '(empty)'}</div>
                                  </div>
                                  
                                  {/* Show actual output */}
                                  <div className={`p-3 rounded ${
                                    test.status === 'Accepted' ? 'bg-green-900/30' : 'bg-red-900/30'
                                  }`}>
                                    <div className="font-semibold text-gray-400 mb-1">Your Output:</div>
                                    <div className="font-mono text-gray-300">{test.stdout || '(empty)'}</div>
                                  </div>
                                  
                                  {/* Show stderr if exists */}
                                  {test.stderr && (
                                    <div className="bg-red-900/30 p-3 rounded border border-red-500/30">
                                      <div className="font-semibold text-red-400 mb-1">Error:</div>
                                      <div className="font-mono text-sm text-red-300 whitespace-pre-wrap">{test.stderr}</div>
                                    </div>
                                  )}
                                  
                                  {/* Show compile output if exists */}
                                  {test.compile_output && (
                                    <div className="bg-yellow-900/30 p-3 rounded border border-yellow-500/30">
                                      <div className="font-semibold text-yellow-400 mb-1">Compilation Error:</div>
                                      <div className="font-mono text-sm text-yellow-300 whitespace-pre-wrap">{test.compile_output}</div>
                                    </div>
                                  )}
                                  
                                  {/* Show explanation if available */}
                                  {visibleTest?.explanation && (
                                    <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
                                      <div className="font-semibold text-blue-400 mb-1">Explanation:</div>
                                      <div className="text-sm text-gray-300">{visibleTest.explanation}</div>
                                    </div>
                                  )}
                                  
                                  {/* Show runtime and memory */}
                                  <div className="flex gap-4 text-xs text-gray-400">
                                    {test.time && (
                                      <div>
                                        <strong>Time:</strong> {test.time}s
                                      </div>
                                    )}
                                    {test.memory && (
                                      <div>
                                        <strong>Memory:</strong> {test.memory}KB
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      /* Unknown format */
                      <div className="alert alert-warning">
                        <div>Unexpected response format. Check console.</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Click "Run" to test your solution for evaluation.</p>
                  </div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-lg font-semibold mb-4 text-white">Submission Result</h3>
                {submitResult ? (
                  <div className={`alert ${
                    submitResult.accepted === true || submitResult.status === 'accepted' 
                      ? 'alert-success' 
                      : 'alert-error'
                  }`}>
                    <div className="w-full">
                      {submitResult.accepted === true || submitResult.status === 'accepted' ? (
                        <>
                          <h4 className="font-bold text-lg">✅ Accepted</h4>
                          <div className="mt-4 space-y-2">
                            <p>
                              Test Cases Passed: {submitResult.testCasesPassed || submitResult.passedTestCases}/{submitResult.testCasesTotal || submitResult.totalTestCases}
                            </p>
                            <p>
                              Runtime: {submitResult.runtime} sec
                            </p>
                            <p>
                              Memory: {submitResult.memory}KB
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-lg">
                            ❌ {submitResult.status === 'wrong' ? 'Wrong Answer' : 
                                submitResult.status === 'error' ? 'Runtime Error' :
                                submitResult.errorMessage || submitResult.error || 'Submission Failed'}
                          </h4>
                          {submitResult.details && (
                            <div className="mt-3 bg-base-100 p-3 rounded">
                              <p className="text-sm font-mono text-gray-300">{submitResult.details}</p>
                            </div>
                          )}
                          {submitResult.errorMessage && (
                            <div className="mt-3 bg-base-100 p-3 rounded">
                              <p className="text-sm font-mono text-gray-300">{submitResult.errorMessage}</p>
                            </div>
                          )}
                          <div className="mt-4 space-y-2">
                            <p>
                              Test Cases Passed: {submitResult.testCasesPassed || submitResult.passedTestCases || 0}/{submitResult.testCasesTotal || submitResult.totalTestCases || 0}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Click "Submit" to submit your solution for evaluation.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
        <AIChatAssistant problem ={problem} getCurrentCode = {getCurrentCode} />
    </div>
  );
};

export default ProblemPage;