import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { Link } from 'react-router';
import { useParams } from 'react-router';
import axiosClient from '../src/utils/axiosClient';
import AIChatAssistant, { renderMessageContent } from "./chatAi"
import { useDispatch, useSelector } from 'react-redux';
import { saveCode, selectCode, clearLanguageCode, clearProblemCode, markProblemInitialized, selectIsInitialized } from '../src/utils/codeSlice';
import Editorial from "./Editorial"
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
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
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);
  const editorRef = useRef(null);
  const [showDiff, setShowDiff] = useState(false);
  const [diffOriginal, setDiffOriginal] = useState("");
  const [diffModified, setDiffModified] = useState("");

  // AI Analyser Tab States
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // Discussion Tab States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // User Hover Stats Popup States
  const [hoveredUserStats, setHoveredUserStats] = useState(null);
  const [loadingHoverStats, setLoadingHoverStats] = useState(false);
  const [statsTooltipUserId, setStatsTooltipUserId] = useState(null);
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
      // Backend may return an array directly or wrap it in an object
      const data = response.data;
      setSubmissions(Array.isArray(data) ? data : (data?.submissions ?? data?.data ?? []));
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

  /* AI ANALYSER TRIGGER METHOD */
  const handleAnalyzeCode = async (codeToAnalyze) => {
    setAnalyzing(true);
    setAiAnalysis("");
    setActiveLeftTab('ai-analyser');
    try {
      const response = await axiosClient.post("/ai/analyze", {
        code: codeToAnalyze,
        language: selectedLanguage,
        problemTitle: problem?.title || "Problem",
        problemDescription: problem?.description || "Description",
      });
      setAiAnalysis(response.data.feedback);
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAnalysis("Failed to analyze code. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  /* DISCUSSION TRIGGER & POSTING METHODS */
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await axiosClient.get(`/discussion/${problemId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const response = await axiosClient.post("/discussion/comment", {
        problemId,
        content: newComment,
      });
      setNewComment("");
      setComments((prev) => [response.data, ...prev]);
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.response?.data?.error || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleFetchUserStats = async (userId) => {
    setStatsTooltipUserId(userId);
    setLoadingHoverStats(true);
    setHoveredUserStats(null);
    try {
      const response = await axiosClient.get(`/discussion/user-stats/${userId}`);
      setHoveredUserStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoadingHoverStats(false);
    }
  };

  /* FETCH COMMENTS WHEN DISCUSSION TAB ACTIVE */
  useEffect(() => {
    if (activeLeftTab === 'discussion') {
      fetchComments();
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
      <div className="flex items-center justify-center h-screen bg-[#080d18]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-emerald-500"></span>
          <p className="text-zinc-500 text-sm font-medium animate-pulse">Loading problem...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen bg-[#0a0f1e] text-zinc-100">
      {/*  TOP NAVBAR */}
      <nav className="relative flex items-center justify-between px-5 py-2.5 bg-[#0a0f1e]/95 border-b border-zinc-800/60 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/70 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-lg transition-all text-sm font-medium border border-zinc-700/50">
            <ChevronLeft size={15} />
            <span>Problems</span>
          </Link>
          <div className="w-px h-4 bg-zinc-700"></div>
          <h2 className="text-sm font-semibold text-zinc-300 truncate max-w-[280px]">
            {problem?.title || 'Loading...'}
          </h2>
          {problem?.difficulty && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              problem.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              problem.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>{problem.difficulty}</span>
          )}
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 group hover:border-emerald-500/40 transition-all cursor-default select-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-mono font-medium text-zinc-500 tracking-wider uppercase group-hover:text-zinc-300 transition-colors">
            Break it down to <span className="text-emerald-400 font-bold">0</span> and <span className="text-emerald-400 font-bold">1</span>s
          </span>
        </div>

        <div className="flex items-center gap-3">

        </div>
      </nav>

      {/*  MAIN SPLIT VIEW  */}
      <div className="flex flex-1 overflow-hidden">
        {/*  LEFT PANEL  */}
        <div className="w-1/2 flex flex-col border-r border-zinc-800/60 bg-[#0d1117]">
          {/* Left Tabs */}
          <div className="flex border-b border-zinc-800/60 bg-[#0a0f1a] overflow-x-auto shrink-0">
            {['description','editorial','solutions','submissions','ai-analyser','discussion'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                className={`px-5 py-3.5 text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeLeftTab === tab
                    ? 'text-emerald-400 border-b-2 border-emerald-500 bg-[#0d1117]'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                }`}
              >
                {tab === 'ai-analyser' ? 'AI Analyser' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-7">
            {activeLeftTab === 'description' && (
              <div className="space-y-6">
                {problem ? (
                  <>
                    {/* Problem Title */}
                    <div>
                      <h1 className="text-xl font-bold text-white mb-3">{problem.title}</h1>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          problem.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
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
            )}

            {activeLeftTab === 'submissions' && (
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
            )}

            {activeLeftTab === 'ai-analyser' && (
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
            )}

            {activeLeftTab === 'discussion' && (
              <div className="py-6 space-y-6">
                <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Discussion Forum</h3>
                  <button
                    onClick={fetchComments}
                    className="btn btn-xs bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
                  >
                    Refresh Comments
                  </button>
                </div>

                {/* Comment Box Form */}
                <form onSubmit={handlePostComment} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <textarea
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or share your approach..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder-zinc-600 resize-none"
                    maxLength="500"
                  />
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span>{newComment.length}/500</span>
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                    >
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                {loadingComments ? (
                  <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : comments && comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700/60 transition-colors duration-150"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            {/* Avatar Circle */}
                            <div className="w-8 h-8 rounded-full bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                              {comment.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              {/* Relative Profile Solved-Stats Popup Tooltip */}
                              <div className="relative inline-block">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (statsTooltipUserId === comment._id) {
                                      setStatsTooltipUserId(null);
                                    } else {
                                      setStatsTooltipUserId(comment._id);
                                      handleFetchUserStats(comment.userId);
                                    }
                                  }}
                                  className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer text-sm"
                                >
                                  {comment.userName}
                                </span>

                                {statsTooltipUserId === comment._id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute left-0 bottom-full mb-3.5 z-[100] w-64 p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl text-left animate-fade-in"
                                  >
                                    <div className="flex justify-between items-start mb-3 border-b border-zinc-850 pb-2">
                                      <div>
                                        <h4 className="font-bold text-white text-sm">@{hoveredUserStats?.userName || 'User'}</h4>
                                        <p className="text-[10px] text-zinc-500 mt-0.5 font-medium tracking-wide uppercase">Stats Gauge</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setStatsTooltipUserId(null);
                                        }}
                                        className="text-zinc-500 hover:text-zinc-350 text-xs font-bold bg-zinc-850 hover:bg-zinc-800 h-5 w-5 rounded-full flex items-center justify-center transition-colors"
                                      >
                                        ✕
                                      </button>
                                    </div>

                                    {loadingHoverStats ? (
                                      <div className="flex justify-center py-4">
                                        <span className="loading loading-spinner loading-sm text-indigo-500"></span>
                                      </div>
                                    ) : hoveredUserStats ? (
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs text-zinc-400">
                                          <span>Total Solved:</span>
                                          <span className="font-extrabold text-white text-sm">{hoveredUserStats.total}</span>
                                        </div>

                                        <div className="space-y-2">
                                          <div>
                                            <div className="flex justify-between text-[10px] mb-1 font-semibold uppercase tracking-wider">
                                              <span className="text-emerald-400">Easy</span>
                                              <span className="text-zinc-400">{hoveredUserStats.easy}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${hoveredUserStats.total > 0 ? (hoveredUserStats.easy / hoveredUserStats.total) * 100 : 0}%` }}
                                              />
                                            </div>
                                          </div>

                                          <div>
                                            <div className="flex justify-between text-[10px] mb-1 font-semibold uppercase tracking-wider">
                                              <span className="text-amber-400">Medium</span>
                                              <span className="text-zinc-400">{hoveredUserStats.medium}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-amber-500"
                                                style={{ width: `${hoveredUserStats.total > 0 ? (hoveredUserStats.medium / hoveredUserStats.total) * 100 : 0}%` }}
                                              />
                                            </div>
                                          </div>

                                          <div>
                                            <div className="flex justify-between text-[10px] mb-1 font-semibold uppercase tracking-wider">
                                              <span className="text-rose-400">Hard</span>
                                              <span className="text-zinc-400">{hoveredUserStats.hard}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-rose-500"
                                                style={{ width: `${hoveredUserStats.total > 0 ? (hoveredUserStats.hard / hoveredUserStats.total) * 100 : 0}%` }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-xs text-zinc-500">Failed to load stats</p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-500 mt-0.5">
                                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-300 pl-10 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-zinc-750" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-zinc-500">No discussion comments yet. Be the first to ask or answer!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/*  RIGHT PANEL (CODE EDITOR) */}
        <div className="w-1/2 flex flex-col bg-[#0d1117]">
          {/* Right Tabs + Language Selector */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 bg-[#0a0f1a] shrink-0">
            <div className="flex">
              {['code','testcase','result'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveRightTab(tab)}
                  className={`px-5 py-3.5 text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                    activeRightTab === tab
                      ? 'text-emerald-400 border-b-2 border-emerald-500 bg-[#0d1117]'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                  }`}
                >
                  {tab === 'code' ? 'Code' : tab === 'testcase' ? 'Test Results' : 'Submission'}
                </button>
              ))}
            </div>

            {activeRightTab === 'code' && (
              <div className="px-4 py-2">
                <select
                  className="bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-emerald-500/40 focus:border-emerald-500/60 transition-all font-medium"
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
                      lineNumbers: 'on',
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
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
            )}

            {activeRightTab === 'testcase' && (
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
                                className={`p-4 rounded-xl border ${
                                  test.status === 'Accepted'
                                    ? 'border-emerald-500/30 bg-emerald-500/5'
                                    : 'border-rose-500/30 bg-rose-500/5'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Test Case {index + 1}</h5>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    test.status === 'Accepted'
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
                                  <div className={`p-3 rounded-lg border ${
                                    test.status === 'Accepted' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
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
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-bold mb-4 text-zinc-300 uppercase tracking-wider">Submission Result</h3>
                {submitResult ? (
                  <div>
                    {submitResult.accepted === true || submitResult.status === 'accepted' ? (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                        <h4 className="font-black text-2xl text-emerald-400 mb-1">✅ Accepted</h4>
                        <p className="text-zinc-500 text-sm mb-4">Your solution passed all test cases.</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Passed</p>
                            <p className="text-lg font-black text-white">{submitResult.testCasesPassed || submitResult.passedTestCases}/{submitResult.testCasesTotal || submitResult.totalTestCases}</p>
                          </div>
                          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Runtime</p>
                            <p className="text-lg font-black text-white">{submitResult.runtime}s</p>
                          </div>
                          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Memory</p>
                            <p className="text-lg font-black text-white">{submitResult.memory}KB</p>
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
            )}
          </div>
        </div>
      </div>
      <AIChatAssistant problem={problem} getCurrentCode={getCurrentCode} />

      {/* Diff Comparison Modal */}
      {showDiff && (
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
      )}
    </div>
  );
};

export default ProblemPage;