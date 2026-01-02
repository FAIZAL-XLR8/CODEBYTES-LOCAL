import { useState, useEffect } from "react";
import axiosClient from "../src/utils/axiosClient";
import axios from "axios";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "easy",
    description: "",
    tags: "array",
    visibleTestCase: [{ input: "", output: "", explaination: "" }],
    hiddenTestCase: [{ input: "", output: "" }],
    startCode: [
      { language: "C++", boilerCode: "" },
      { language: "Java", boilerCode: "" },
      { language: "Javascript", boilerCode: "" },
    ],
    referenceSolution: [
      { language: "C++", solutionCode: "" },
      { language: "Java", solutionCode: "" },
      { language: "Javascript", solutionCode: "" },
    ],
  });

  // Editorial state
  const [editorialData, setEditorialData] = useState({
    videoFile: null,
    videoSize : null,
   
  });

  const [selectedProblemId, setSelectedProblemId] = useState("");

  // Fetch all problems
  useEffect(() => {
    if (
      activeTab === "update" ||
      activeTab === "delete" ||
      activeTab === "editorial"
    ) {
      fetchProblems();
    }
  }, [activeTab]);

  const fetchProblems = async () => {
    try {
      const response = await axiosClient.get("/problem/getAllProblems");
      setProblems(response.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      showMessage("Error fetching problems", "error");
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle editorial input changes
  const handleEditorialChange = (e) => {
    const { name, value } = e.target;
    setEditorialData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle video file upload
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validTypes.includes(file.type)) {
        showMessage(
          "Please upload a valid video file (MP4, WebM, or OGG)",
          "error"
        );
        return;
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        showMessage("Video file size should not exceed 100MB", "error");
        return;
      }

      setEditorialData((prev) => ({ ...prev, videoFile: file }));
    }
  };



  // Handle visible test case changes
  const handleVisibleTestChange = (index, field, value) => {
    const updated = [...formData.visibleTestCase];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, visibleTestCase: updated }));
  };

  const addVisibleTest = () => {
    setFormData((prev) => ({
      ...prev,
      visibleTestCase: [
        ...prev.visibleTestCase,
        { input: "", output: "", explaination: "" },
      ],
    }));
  };

  const removeVisibleTest = (index) => {
    setFormData((prev) => ({
      ...prev,
      visibleTestCase: prev.visibleTestCase.filter((_, i) => i !== index),
    }));
  };

  // Handle hidden test case changes
  const handleHiddenTestChange = (index, field, value) => {
    const updated = [...formData.hiddenTestCase];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, hiddenTestCase: updated }));
  };

  const addHiddenTest = () => {
    setFormData((prev) => ({
      ...prev,
      hiddenTestCase: [...prev.hiddenTestCase, { input: "", output: "" }],
    }));
  };

  const removeHiddenTest = (index) => {
    setFormData((prev) => ({
      ...prev,
      hiddenTestCase: prev.hiddenTestCase.filter((_, i) => i !== index),
    }));
  };

  // Handle start code changes
  const handleStartCodeChange = (index, value) => {
    const updated = [...formData.startCode];
    updated[index].boilerCode = value;
    setFormData((prev) => ({ ...prev, startCode: updated }));
  };

  // Handle reference solution changes
  const handleReferenceSolutionChange = (index, value) => {
    const updated = [...formData.referenceSolution];
    updated[index].solutionCode = value;
    setFormData((prev) => ({ ...prev, referenceSolution: updated }));
  };

  // Load problem for editing
  const loadProblemForEdit = async (problemId) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/problem/problemById/${problemId}`
      );
      const problem = response.data;

      setFormData({
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description,
        tags: problem.tags,
        visibleTestCase: problem.visibleTestCase || [
          { input: "", output: "", explaination: "" },
        ],
        hiddenTestCase: problem.hiddenTestCase || [{ input: "", output: "" }],
        startCode: problem.startCode || [
          { language: "C++", boilerCode: "" },
          { language: "Java", boilerCode: "" },
          { language: "Javascript", boilerCode: "" },
        ],
        referenceSolution: problem.referenceSolution || [
          { language: "C++", solutionCode: "" },
          { language: "Java", solutionCode: "" },
          { language: "Javascript", solutionCode: "" },
        ],
      });
      setSelectedProblemId(problemId);
    } catch (error) {
      console.error("Error loading problem:", error);
      showMessage("Error loading problem", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete editorial
  const handleDeleteEditorial = async (problemId) => {
    const problem = problems.find((p) => p._id === problemId);
    if (
      !window.confirm(
        `Are you sure you want to delete the editorial video for "${problem?.title}"?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axiosClient.delete(`/video/${problemId}`);
      showMessage("Editorial deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting editorial:", error);
      showMessage(
        error.response?.data?.error || "Error deleting editorial",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Create problem
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosClient.post("/problem/create", formData);
      showMessage("Problem created successfully!", "success");
      resetForm();
    } catch (error) {
      console.error("Error creating problem:", error);
      showMessage(error.response?.data || "Error creating problem", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update problem
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProblemId) {
      showMessage("Please select a problem to update", "error");
      return;
    }
    try {
      setLoading(true);
      await axiosClient.put(`/problem/update/${selectedProblemId}`, formData);
      showMessage("Problem updated successfully!", "success");
      fetchProblems();
    } catch (error) {
      console.error("Error updating problem:", error);
      showMessage(error.response?.data || "Error updating problem", "error");
    } finally {
      setLoading(false);
    }
  };

  // Upload/Update editorial
  const handleEditorialSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProblemId) {
      showMessage("Please select a problem first", "error");
      return;
    }
    setUploadProgress(0);

    try {
      setUploadingVideo(true);
      const signatureResponse = await axiosClient.get(
        `/video/create/${selectedProblemId}`
      );
      const {
        signature,
        timestamp,
        public_id,
        api_key,
        cloud_name,
        upload_url,
      } = signatureResponse.data;
         
      const formDataToSend = new FormData();
      //     FormData is a browser-provided object used to construct and send
      // multipart/form-data HTTP requests.
      // Add video file if selected
    
        formDataToSend.append("file", editorialData.videoFile);
     
      
      
      formDataToSend.append("signature", signature);
      formDataToSend.append("timestamp", timestamp);
      formDataToSend.append("public_id", public_id);
      formDataToSend.append("api_key", api_key);
     const uploadResponse = await axios.post(upload_url, formDataToSend, {
  headers: {
    "Content-Type": "multipart/form-data"
  },
  onUploadProgress: (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadProgress(progress);
  },
});
      const cloudinaryResponse = uploadResponse.data;
      //save the metadata
      const metadataResponse = await axiosClient.post("/video/save", {
        problemId: selectedProblemId,
        cloudinaryPublicId: cloudinaryResponse.public_id,
        secureUrl: cloudinaryResponse.secure_url,
        duration: cloudinaryResponse.duration,
      });
      setUploadedVideo(metadataResponse.data.videoSolution);
      showMessage("Editorial uploaded successfully!", "success");
      resetEditorialForm();
    } catch (error) {
      console.error("Error uploading editorial:", error);
      showMessage(
        error.response?.data?.message || "Error uploading editorial",
        "error"
      );
    } finally {
      setUploadingVideo(false);
    }
  };

  // Delete problem
  const handleDelete = async (problemId) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) {
      return;
    }
    try {
      setLoading(true);
      await axiosClient.delete(`/problem/delete/${problemId}`);
      showMessage("Problem deleted successfully!", "success");
      fetchProblems();
    } catch (error) {
      console.error("Error deleting problem:", error);
      showMessage(error.response?.data || "Error deleting problem", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      difficulty: "easy",
      description: "",
      tags: "array",
      visibleTestCase: [{ input: "", output: "", explaination: "" }],
      hiddenTestCase: [{ input: "", output: "" }],
      startCode: [
        { language: "C++", boilerCode: "" },
        { language: "Java", boilerCode: "" },
        { language: "Javascript", boilerCode: "" },
      ],
      referenceSolution: [
        { language: "C++", solutionCode: "" },
        { language: "Java", solutionCode: "" },
        { language: "Javascript", solutionCode: "" },
      ],
    });
    setSelectedProblemId("");
  };

  const resetEditorialForm = () => {
    setEditorialData({
      videoFile: null,
      videoSize : null
    
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      {/* Header */}
      <nav className="bg-[#282828] border-b border-[#3d3d3d] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <a href="/" className="btn btn-sm btn-ghost">
            Back to Home
          </a>
        </div>
      </nav>

      {/* Message Toast */}
      {message && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-error"
          } fixed top-20 right-6 w-96 shadow-lg z-50`}
        >
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[#282828] border-b border-[#3d3d3d]">
        <div className="flex px-6">
          <button
            onClick={() => {
              setActiveTab("create");
              resetForm();
            }}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "create"
                ? "text-white border-b-2 border-primary bg-[#2d2d2d]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Create Problem
          </button>
          <button
            onClick={() => {
              setActiveTab("update");
              resetForm();
            }}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "update"
                ? "text-white border-b-2 border-primary bg-[#2d2d2d]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Update Problem
          </button>
          <button
            onClick={() => {
              setActiveTab("editorial");
              resetEditorialForm();
            }}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "editorial"
                ? "text-white border-b-2 border-primary bg-[#2d2d2d]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Editorial
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "delete"
                ? "text-white border-b-2 border-primary bg-[#2d2d2d]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Delete Problem
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* CREATE TAB */}
        {activeTab === "create" && (
          <div className="bg-[#282828] rounded-lg p-6 border border-[#3d3d3d]">
            <h2 className="text-xl font-bold mb-6">Create New Problem</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Difficulty</span>
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="select select-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Tags</span>
                </label>
                <select
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="select select-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">Dynamic Programming</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-32 bg-[#1e1e1e] border-[#3d3d3d]"
                  required
                />
              </div>

              {/* Visible Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Visible Test Cases</h3>
                  <button
                    type="button"
                    onClick={addVisibleTest}
                    className="btn btn-sm btn-primary"
                  >
                    Add Test Case
                  </button>
                </div>
                {formData.visibleTestCase.map((test, index) => (
                  <div
                    key={index}
                    className="bg-[#1e1e1e] p-4 rounded-lg mb-4 border border-[#3d3d3d]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Test Case {index + 1}</h4>
                      {formData.visibleTestCase.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVisibleTest(index)}
                          className="btn btn-xs btn-error"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs">Input</span>
                        </label>
                        <textarea
                          value={test.input}
                          onChange={(e) =>
                            handleVisibleTestChange(
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                          rows="3"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs">Output</span>
                        </label>
                        <textarea
                          value={test.output}
                          onChange={(e) =>
                            handleVisibleTestChange(
                              index,
                              "output",
                              e.target.value
                            )
                          }
                          className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                          rows="3"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs">
                            Explanation
                          </span>
                        </label>
                        <textarea
                          value={test.explaination}
                          onChange={(e) =>
                            handleVisibleTestChange(
                              index,
                              "explaination",
                              e.target.value
                            )
                          }
                          className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                          rows="3"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hidden Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Hidden Test Cases</h3>
                  <button
                    type="button"
                    onClick={addHiddenTest}
                    className="btn btn-sm btn-primary"
                  >
                    Add Test Case
                  </button>
                </div>
                {formData.hiddenTestCase.map((test, index) => (
                  <div
                    key={index}
                    className="bg-[#1e1e1e] p-4 rounded-lg mb-4 border border-[#3d3d3d]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Hidden Test {index + 1}</h4>
                      {formData.hiddenTestCase.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHiddenTest(index)}
                          className="btn btn-xs btn-error"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs">Input</span>
                        </label>
                        <textarea
                          value={test.input}
                          onChange={(e) =>
                            handleHiddenTestChange(
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                          rows="3"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs">Output</span>
                        </label>
                        <textarea
                          value={test.output}
                          onChange={(e) =>
                            handleHiddenTestChange(
                              index,
                              "output",
                              e.target.value
                            )
                          }
                          className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                          rows="3"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Start Code */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Starter Code</h3>
                {formData.startCode.map((code, index) => (
                  <div key={index} className="mb-4">
                    <label className="label">
                      <span className="label-text text-gray-300">
                        {code.language}
                      </span>
                    </label>
                    <textarea
                      value={code.boilerCode}
                      onChange={(e) =>
                        handleStartCodeChange(index, e.target.value)
                      }
                      className="textarea textarea-bordered w-full h-32 bg-[#1e1e1e] border-[#3d3d3d] font-mono text-sm"
                      placeholder={`Enter ${code.language} starter code...`}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Reference Solution */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Reference Solutions
                </h3>
                {formData.referenceSolution.map((solution, index) => (
                  <div key={index} className="mb-4">
                    <label className="label">
                      <span className="label-text text-gray-300">
                        {solution.language}
                      </span>
                    </label>
                    <textarea
                      value={solution.solutionCode}
                      onChange={(e) =>
                        handleReferenceSolutionChange(index, e.target.value)
                      }
                      className="textarea textarea-bordered w-full h-32 bg-[#1e1e1e] border-[#3d3d3d] font-mono text-sm"
                      placeholder={`Enter ${solution.language} solution code...`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Create Problem"
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-ghost"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        )}

        {/* UPDATE TAB */}
        {activeTab === "update" && (
          <div className="space-y-6">
            <div className="bg-[#282828] rounded-lg p-6 border border-[#3d3d3d]">
              <h2 className="text-xl font-bold mb-4">
                Select Problem to Update
              </h2>
              <div className="form-control">
                <select
                  value={selectedProblemId}
                  onChange={(e) => loadProblemForEdit(e.target.value)}
                  className="select select-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                >
                  <option value="">Choose a problem...</option>
                  {problems.map((problem) => (
                    <option key={problem._id} value={problem._id}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProblemId && (
              <div className="bg-[#282828] rounded-lg p-6 border border-[#3d3d3d]">
                <h2 className="text-xl font-bold mb-6">Update Problem</h2>
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Title</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input input-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">
                          Difficulty
                        </span>
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="select select-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300">Tags</span>
                    </label>
                    <select
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="select select-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                    >
                      <option value="array">Array</option>
                      <option value="linkedList">Linked List</option>
                      <option value="graph">Graph</option>
                      <option value="dp">Dynamic Programming</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300">
                        Description
                      </span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-32 bg-[#1e1e1e] border-[#3d3d3d]"
                      required
                    />
                  </div>

                  {/* Visible Test Cases */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Visible Test Cases
                      </h3>
                      <button
                        type="button"
                        onClick={addVisibleTest}
                        className="btn btn-sm btn-primary"
                      >
                        Add Test Case
                      </button>
                    </div>
                    {formData.visibleTestCase.map((test, index) => (
                      <div
                        key={index}
                        className="bg-[#1e1e1e] p-4 rounded-lg mb-4 border border-[#3d3d3d]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">
                            Test Case {index + 1}
                          </h4>
                          {formData.visibleTestCase.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVisibleTest(index)}
                              className="btn btn-xs btn-error"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Input</span>
                            </label>
                            <textarea
                              value={test.input}
                              onChange={(e) =>
                                handleVisibleTestChange(
                                  index,
                                  "input",
                                  e.target.value
                                )
                              }
                              className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                              rows="3"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Output</span>
                            </label>
                            <textarea
                              value={test.output}
                              onChange={(e) =>
                                handleVisibleTestChange(
                                  index,
                                  "output",
                                  e.target.value
                                )
                              }
                              className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                              rows="3"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">
                                Explanation
                              </span>
                            </label>
                            <textarea
                              value={test.explaination}
                              onChange={(e) =>
                                handleVisibleTestChange(
                                  index,
                                  "explaination",
                                  e.target.value
                                )
                              }
                              className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                              rows="3"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hidden Test Cases */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Hidden Test Cases
                      </h3>
                      <button
                        type="button"
                        onClick={addHiddenTest}
                        className="btn btn-sm btn-primary"
                      >
                        Add Test Case
                      </button>
                    </div>
                    {formData.hiddenTestCase.map((test, index) => (
                      <div
                        key={index}
                        className="bg-[#1e1e1e] p-4 rounded-lg mb-4 border border-[#3d3d3d]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">
                            Hidden Test {index + 1}
                          </h4>
                          {formData.hiddenTestCase.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHiddenTest(index)}
                              className="btn btn-xs btn-error"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Input</span>
                            </label>
                            <textarea
                              value={test.input}
                              onChange={(e) =>
                                handleHiddenTestChange(
                                  index,
                                  "input",
                                  e.target.value
                                )
                              }
                              className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                              rows="3"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Output</span>
                            </label>
                            <textarea
                              value={test.output}
                              onChange={(e) =>
                                handleHiddenTestChange(
                                  index,
                                  "output",
                                  e.target.value
                                )
                              }
                              className="textarea textarea-sm textarea-bordered bg-[#282828] border-[#3d3d3d]"
                              rows="3"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Start Code */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Starter Code</h3>
                    {formData.startCode.map((code, index) => (
                      <div key={index} className="mb-4">
                        <label className="label">
                          <span className="label-text text-gray-300">
                            {code.language}
                          </span>
                        </label>
                        <textarea
                          value={code.boilerCode}
                          onChange={(e) =>
                            handleStartCodeChange(index, e.target.value)
                          }
                          className="textarea textarea-bordered w-full h-32 bg-[#1e1e1e] border-[#3d3d3d] font-mono text-sm"
                          placeholder={`Enter ${code.language} starter code...`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  {/* Reference Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Reference Solutions
                    </h3>
                    {formData.referenceSolution.map((solution, index) => (
                      <div key={index} className="mb-4">
                        <label className="label">
                          <span className="label-text text-gray-300">
                            {solution.language}
                          </span>
                        </label>
                        <textarea
                          value={solution.solutionCode}
                          onChange={(e) =>
                            handleReferenceSolutionChange(index, e.target.value)
                          }
                          className="textarea textarea-bordered w-full h-32 bg-[#1e1e1e] border-[#3d3d3d] font-mono text-sm"
                          placeholder={`Enter ${solution.language} solution code...`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-warning"
                    >
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Update Problem"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setSelectedProblemId("");
                      }}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* EDITORIAL TAB */}
        {activeTab === "editorial" && (
          <div className="space-y-6">
            {/* UPLOAD SECTION */}
            <div className="bg-[#282828] rounded-lg p-6 border border-[#3d3d3d]">
              <h2 className="text-xl font-bold mb-4">Upload Editorial Video</h2>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-gray-300">
                    Select Problem
                  </span>
                </label>
                <select
                  value={selectedProblemId}
                  onChange={(e) => setSelectedProblemId(e.target.value)}
                  className="select select-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                >
                  <option value="">Choose a problem...</option>
                  {problems.map((problem) => (
                    <option key={problem._id} value={problem._id}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProblemId && (
                <form onSubmit={handleEditorialSubmit} className="space-y-6">
               
                

                  {/* Upload Options */}
                  <div className="divider">Upload Method</div>

                  {/* Video File Upload */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300">
                        Upload Video File
                      </span>
                      <span className="label-text-alt text-gray-500">
                        Max 100MB • MP4, WebM, OGG
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={handleVideoFileChange}
                      className="file-input file-input-bordered bg-[#1e1e1e] border-[#3d3d3d] w-full"
                    />
                    {editorialData.videoFile && (
                      <div className="mt-2 text-sm text-green-400">
                        ✓ Selected: {editorialData.videoFile.name}
                          <br></br> Video Size : {`${Math.round(editorialData.videoFile.size/(1024 *1024))}MB`}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={
                        uploadingVideo ||
                        (!editorialData.videoFile && !editorialData.videoUrl)
                      }
                      className="btn btn-success"
                    >
                      {uploadingVideo ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Uploading...
                        </>
                      ) : (
                        "Upload Editorial"
                      )}
                    </button>
                    

                    <button
                      type="button"
                      onClick={() => {
                        resetEditorialForm();
                        setSelectedProblemId("");
                      }}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    
                    {uploadingVideo && (
  <div className="mt-4">
    <progress
      className="progress progress-success w-full"
      value={uploadProgress}
      max="100"
    ></progress>
    <p className="text-sm text-gray-400 mt-1">
      Uploading: {uploadProgress}%
    </p>
  </div>
)}
                  </div>
                </form>
              )}
            </div>

            {/* DELETE SECTION */}
            <div className="bg-[#282828] rounded-lg p-6 border border-[#3d3d3d]">
              <h2 className="text-xl font-bold mb-4">Delete Editorial Video</h2>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-gray-300">
                    Select Problem with Editorial
                  </span>
                </label>
                <select
                  className="select select-bordered bg-[#1e1e1e] border-[#3d3d3d]"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDeleteEditorial(e.target.value);
                      e.target.value = ""; 
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">
                    Choose a problem to delete editorial...
                  </option>
                  {problems.map((problem) => (
                    <option key={problem._id} value={problem._id}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              </div>
              <div className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  Selecting a problem will immediately prompt you to delete its
                  editorial video.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DELETE TAB */}
        {activeTab === "delete" && (
          <div className="bg-[#282828] rounded-lg p-6 border border-[#3d3d3d]">
            <h2 className="text-xl font-bold mb-6">Delete Problems</h2>
            <div className="space-y-4">
              {problems.map((problem) => (
                <div
                  key={problem._id}
                  className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg border border-[#3d3d3d]"
                >
                  <div>
                    <h3 className="font-semibold text-white">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Difficulty: {problem.difficulty} | Tags: {problem.tags}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    disabled={loading}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {problems.length === 0 && (
                <p className="text-center text-gray-400 py-12">
                  No problems found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
