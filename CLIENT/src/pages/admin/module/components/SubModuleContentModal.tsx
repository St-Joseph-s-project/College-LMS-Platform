import React, { useState, useEffect } from "react";
import { X, Loader, Plus, Trash2 } from "lucide-react";
// @ts-ignore
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getSubModuleContentById, updateSubModuleContent } from "../api/subModuleApi";
import type { SubModuleType, Question } from "../types/subModule";
import { toast } from "react-toastify";

interface SubModuleContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subModuleId: number;
  subModuleType: SubModuleType;
  subModuleName: string;
}

const SubModuleContentModal: React.FC<SubModuleContentModalProps> = ({
  isOpen,
  onClose,
  subModuleId,
  subModuleType,
  subModuleName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (isOpen && subModuleId) {
      fetchContent();
    } else {
      resetState();
    }
  }, [isOpen, subModuleId]);

  const resetState = () => {
    setContent("");
    setVideoUrl("");
    setQuestions([]);
  };

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await getSubModuleContentById(subModuleId);
      if (res.data) {
        setContent(res.data.content || "");
        setVideoUrl(res.data.videoUrl || "");
        setQuestions(res.data.testContent || []);
      }
    } catch (error) {
      console.error("Failed to fetch content", error);
      toast.error("Failed to load submodule content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSubModuleContent(subModuleId, {
        content: subModuleType !== "TEST" ? content : undefined,
        videoUrl: subModuleType === "YT" ? videoUrl : undefined,
        testContent: subModuleType === "TEST" ? questions : undefined,
      });
      toast.success("Content saved successfully");
      onClose();
    } catch (error) {
      console.error("Failed to save content", error);
      toast.error("Failed to save submodule content");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Content for: {subModuleName}
            </h2>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Type: {subModuleType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {(subModuleType === "CONTENT" || subModuleType === "YT") && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content (Rich Text)
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col h-[50vh]">
                    <style>{`
                      .quill {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                      }
                      .ql-toolbar {
                        flex-shrink: 0;
                        border-top: none !important;
                        border-left: none !important;
                        border-right: none !important;
                        background-color: #f9fafb;
                      }
                      .ql-container {
                        flex-grow: 1;
                        overflow-y: auto;
                        min-height: 0;
                        border-bottom: none !important;
                        border-left: none !important;
                        border-right: none !important;
                      }
                      .ql-editor {
                        min-height: 100%;
                      }
                    `}</style>
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                    />
                  </div>
                </div>
              )}

              {subModuleType === "YT" && (
                <div className="space-y-2 pt-12 sm:pt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {videoUrl && (
                    <div className="mt-4 aspect-video rounded-lg overflow-hidden border bg-gray-100">
                      <iframe
                        width="100%"
                        height="100%"
                        src={videoUrl.replace("watch?v=", "embed/")}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              )}

              {subModuleType === "TEST" && (
                <TestEditor questions={questions} setQuestions={setQuestions} />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isSaving && <Loader className="animate-spin h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Content"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-component for Test Editor ---
const TestEditor = ({
  questions,
  setQuestions,
}: {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  const addQuestion = () => {
    const newQuestion: Question = {
      questionNo: questions.length > 0 ? Math.max(...questions.map((q) => q.questionNo)) + 1 : 1,
      question: "",
      options: ["", "", "", ""],
      answer: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    // Re-index question numbers sequentially
    const reindexed = newQuestions.map((q, i) => ({ ...q, questionNo: i + 1 }));
    setQuestions(reindexed);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions[optIndex] = value;
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-white z-10 -mt-6 -mx-6 px-6 pt-6 pb-4 border-b border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800">Test Questions</h3>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50 text-gray-500">
          No questions added yet. Click "Add Question" to start.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="relative p-5 bg-white border border-gray-200 rounded-xl shadow-sm group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Question"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 cursor-move text-gray-400">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
                    {q.questionNo}
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Enter the question here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Option {optIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <select
                      value={q.answer}
                      onChange={(e) => updateQuestion(qIndex, "answer", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="" disabled>Select correct answer</option>
                      {q.options.map((opt, optIndex) => (
                        <option key={optIndex} value={opt} disabled={!opt.trim()}>
                          {opt || `Option ${optIndex + 1} (Empty)`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubModuleContentModal;
