import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useParams } from 'react-router';
import axiosClient from '../src/utils/axiosClient';
import AIChatAssistant from "./chatAi"
import { useDispatch, useSelector } from 'react-redux';
import { saveCode, selectCode, clearLanguageCode, clearProblemCode, markProblemInitialized, selectIsInitialized } from '../src/utils/codeSlice';
import Editorial from "./Editorial"
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';

// ── Segregated tab/panel components ──────────────────────────────────────────
import ProblemDescription from './components/problem/ProblemDescription';
import Solutions from './components/problem/Solutions';
import SubmissionsTab from './components/problem/SubmissionsTab';
import AIAnalyser from './components/problem/AIAnalyser';
import Discussion from './components/problem/Discussion';
import CodeEditor from './components/problem/CodeEditor';
import TestResults from './components/problem/TestResults';
import SubmissionResult from './components/problem/SubmissionResult';
import DiffModal from './components/problem/DiffModal';

// Raw TypeScript declaration imports for Node (Point 3 - Option 2)
import globalsDts from '../node_modules/@types/node/globals.d.ts?raw';
import processDts from '../node_modules/@types/node/process.d.ts?raw';
import readlineDts from '../node_modules/@types/node/readline.d.ts?raw';

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
      return;
    }

    // If already initialized, just load the saved code
    if (isInitialized) {
      if (savedCodeForLanguage) {

        setCode(savedCodeForLanguage);
      } else {
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
      return;
      //above says
      // "Don't save if code is empty"
      // "Don't save if this problem+language isn't fully initialized yet"
    }

    const timeoutId = setTimeout(() => {
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
      setCode(initialCode.boilerCode);
    } else {
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

    // 1. Add Node.js type definitions to Monaco (Point 3 - Option 2)
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      globalsDts,
      'ts:node/globals.d.ts'
    );
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      processDts,
      'ts:node/process.d.ts'
    );
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      readlineDts,
      'ts:node/readline.d.ts'
    );

    // Provide a signature helper for require module resolving
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      declare function require(moduleName: 'readline'): typeof import('readline');
      declare function require(moduleName: string): any;
    `, 'ts:node/require.d.ts');

    // 2. Configure JavaScript Language Defaults & Compiler Options (Point 2)
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false, // Turn ON semantic validation (red squiggles on type errors)
      noSyntaxValidation: false,   // Enable syntax validation
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      checkJs: true,                // Enable full type checker for vanilla JS files
      noImplicitAny: true,          // Flag implicit 'any' (e.g. unknown variables like kak) as errors
    });
  };
  const getCurrentCode = () => {
    return editorRef.current?.getValue();
  };
  /* RESET CODE */
  const handleResetCode = () => {
    if (problem) {
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
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${problem.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
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
            {['description', 'editorial', 'solutions', 'submissions', 'ai-analyser', 'discussion'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                className={`px-5 py-3.5 text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${activeLeftTab === tab
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
              <ProblemDescription problem={problem} />
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
              <Solutions problem={problem} />
            )}

            {activeLeftTab === 'submissions' && (
              <SubmissionsTab
                submissions={submissions}
                loadingSubmissions={loadingSubmissions}
                expandedSubmissionId={expandedSubmissionId}
                setExpandedSubmissionId={setExpandedSubmissionId}
                handleAnalyzeCode={handleAnalyzeCode}
                setDiffOriginal={setDiffOriginal}
                setDiffModified={setDiffModified}
                setShowDiff={setShowDiff}
                getCurrentCode={getCurrentCode}
                code={code}
                copyToClipboard={copyToClipboard}
              />
            )}

            {activeLeftTab === 'ai-analyser' && (
              <AIAnalyser
                aiAnalysis={aiAnalysis}
                analyzing={analyzing}
                handleAnalyzeCode={handleAnalyzeCode}
                getCurrentCode={getCurrentCode}
                code={code}
              />
            )}

            {activeLeftTab === 'discussion' && (
              <Discussion
                comments={comments}
                loadingComments={loadingComments}
                newComment={newComment}
                setNewComment={setNewComment}
                submittingComment={submittingComment}
                handlePostComment={handlePostComment}
                fetchComments={fetchComments}
                hoveredUserStats={hoveredUserStats}
                loadingHoverStats={loadingHoverStats}
                statsTooltipUserId={statsTooltipUserId}
                setStatsTooltipUserId={setStatsTooltipUserId}
                handleFetchUserStats={handleFetchUserStats}
              />
            )}
          </div>
        </div>

        {/*  RIGHT PANEL (CODE EDITOR) */}
        <div className="w-1/2 flex flex-col bg-[#0d1117]">
          {/* Right Tabs + Language Selector */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 bg-[#0a0f1a] shrink-0">
            <div className="flex">
              {['code', 'testcase', 'result'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveRightTab(tab)}
                  className={`px-5 py-3.5 text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${activeRightTab === tab
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
              <CodeEditor
                code={code}
                setCode={setCode}
                selectedLangOption={selectedLangOption}
                handleEditorDidMount={handleEditorDidMount}
                handleResetCode={handleResetCode}
                handleRunCode={handleRunCode}
                handleSubmitCode={handleSubmitCode}
                loading={loading}
              />
            )}

            {activeRightTab === 'testcase' && (
              <TestResults runResult={runResult} problem={problem} />
            )}

            {activeRightTab === 'result' && (
              <SubmissionResult submitResult={submitResult} />
            )}
          </div>
        </div>
      </div>
      <AIChatAssistant problem={problem} getCurrentCode={getCurrentCode} />

      {/* Diff Comparison Modal */}
      <DiffModal
        showDiff={showDiff}
        setShowDiff={setShowDiff}
        diffOriginal={diffOriginal}
        diffModified={diffModified}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
};

export default ProblemPage;