import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPlus, FaUsers, FaList, FaEdit, FaTrash, FaUpload, FaShareAlt, FaCopy, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { QRCodeSVG } from 'qrcode.react';
import JoditEditor from 'jodit-react';

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const editor = useRef(null);
    
    // Jodit Editor Config
    const editorConfig = {
        readonly: false,
        placeholder: 'Enter question text, tables, or formatting here...',
        height: 300,
        toolbarSticky: false,
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'table', 'link', 'image', '|',
            'align', 'undo', 'redo', 'hr', 'eraser', 'fullsize'
        ]
    };
    
    const [quizzes, setQuizzes] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // For creating a quiz
    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [newQuizDesc, setNewQuizDesc] = useState('');
    const [newQuizIsPublic, setNewQuizIsPublic] = useState(true);

    // For sharing a quiz
    const [shareModalQuiz, setShareModalQuiz] = useState(null);
    const [shareToken, setShareToken] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    // For managing questions of a specific quiz
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    
    const [newQText, setNewQText] = useState('');
    const [newQA, setNewQA] = useState('');
    const [newQB, setNewQB] = useState('');
    const [newQC, setNewQC] = useState('');
    const [newQD, setNewQD] = useState('');
    const [newQCorrect, setNewQCorrect] = useState('A');

    useEffect(() => {
        if (user.is_admin != 1) {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [qData, uData] = await Promise.all([
                apiClient.getQuizzes(),
                apiClient.getAllUsers()
            ]);
            setQuizzes(qData);
            setUsers(uData);
        } catch (err) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        if (!newQuizTitle.trim()) return;
        try {
            await apiClient.createQuiz(newQuizTitle, newQuizDesc, newQuizIsPublic ? 1 : 0);
            toast.success('Quiz created');
            setNewQuizTitle('');
            setNewQuizDesc('');
            setNewQuizIsPublic(true);
            fetchData();
        } catch (err) {
            toast.error('Failed to create quiz');
        }
    };

    const handleGenerateOneTimeLink = async () => {
        try {
            const data = await apiClient.generateQuizLink(shareModalQuiz.id);
            setShareToken(data.token);
            setLinkCopied(false);
            toast.success('One-time link generated');
        } catch (err) {
            toast.error('Failed to generate link');
        }
    };

    const handleSelectQuiz = async (quizId) => {
        setSelectedQuizId(quizId);
        resetQuestionForm();
        try {
            const data = await apiClient.getAdminQuestions(quizId);
            setQuestions(data);
        } catch (err) {
            toast.error('Failed to load questions');
        }
    };

    const resetQuestionForm = () => {
        setEditingQuestionId(null);
        setNewQText(''); setNewQA(''); setNewQB(''); setNewQC(''); setNewQD(''); setNewQCorrect('A');
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!newQText.trim() || !newQA || !newQB || !newQC || !newQD) {
            toast.error('All fields are required');
            return;
        }
        try {
            if (editingQuestionId) {
                await apiClient.updateQuestion(editingQuestionId, newQText, newQA, newQB, newQC, newQD, newQCorrect);
                toast.success('Question updated');
            } else {
                await apiClient.addQuestion(selectedQuizId, newQText, newQA, newQB, newQC, newQD, newQCorrect);
                toast.success('Question added');
            }
            resetQuestionForm();
            handleSelectQuiz(selectedQuizId); // refresh
        } catch (err) {
            toast.error(editingQuestionId ? 'Failed to update question' : 'Failed to add question');
        }
    };

    const handleEditClick = (q) => {
        setEditingQuestionId(q.id);
        setNewQText(q.question_text);
        setNewQA(q.option_a);
        setNewQB(q.option_b);
        setNewQC(q.option_c);
        setNewQD(q.option_d);
        setNewQCorrect(q.correct_option || 'A');
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await apiClient.deleteQuestion(id);
            toast.success('Question deleted');
            if (editingQuestionId === id) resetQuestionForm();
            handleSelectQuiz(selectedQuizId);
        } catch (err) {
            toast.error('Failed to delete question');
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage Quizzes</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg transition-colors font-medium border border-indigo-200 shadow-sm"
                >
                    <FaUsers /> <span>Manage Users</span>
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                    {/* Left Col: Quizzes & Questions */}
                    <div className="space-y-6">
                        {!selectedQuizId ? (
                            <section className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center space-x-2 text-slate-900">
                                    <FaList className="text-blue-500" /> <span>Manage Quizzes</span>
                                </h2>
                                
                                <form onSubmit={handleCreateQuiz} className="mb-6 space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <input 
                                        type="text" placeholder="Quiz Title" value={newQuizTitle} onChange={e => setNewQuizTitle(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm"
                                    />
                                    <textarea 
                                        placeholder="Description" value={newQuizDesc} onChange={e => setNewQuizDesc(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-20 text-slate-900 text-sm"
                                    />
                                    <div className="flex items-center space-x-2 py-1">
                                        <label className="text-sm text-slate-700 font-medium cursor-pointer flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                                                checked={newQuizIsPublic}
                                                onChange={e => setNewQuizIsPublic(e.target.checked)}
                                            />
                                            <span>Public Quiz (Visible on Dashboard)</span>
                                        </label>
                                    </div>
                                    <button type="submit" className="flex items-center justify-center w-full sm:w-auto space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                        <FaPlus /> <span>Create Quiz</span>
                                    </button>
                                </form>

                                <div className="space-y-3">
                                    {quizzes.map(quiz => (
                                        <div key={quiz.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                                            <div>
                                                <h3 className="font-medium text-slate-900 text-sm flex items-center space-x-2">
                                                    <span>{quiz.title}</span>
                                                    {quiz.is_public == 1 ? (
                                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Public</span>
                                                    ) : (
                                                        <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Private</span>
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="flex space-x-2 w-full sm:w-auto">
                                                <button 
                                                    onClick={() => {
                                                        setShareModalQuiz(quiz);
                                                        setShareToken('');
                                                        setLinkCopied(false);
                                                    }}
                                                    className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium border border-indigo-200 flex-1 sm:flex-none justify-center"
                                                >
                                                    <FaShareAlt /> <span>Share</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleSelectQuiz(quiz.id)}
                                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium border border-slate-200 flex-1 sm:flex-none"
                                                >
                                                    Manage Questions
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                                    <h2 className="text-base md:text-lg font-semibold flex items-center space-x-2 text-slate-900">
                                        <span>Manage Questions</span>
                                    </h2>
                                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                                        <label className="cursor-pointer bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold border border-emerald-200 flex items-center space-x-2">
                                            <FaUpload />
                                            <span>Bulk Excel</span>
                                            <input 
                                                type="file" 
                                                accept=".xlsx, .xls" 
                                                className="hidden" 
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    
                                                    const reader = new FileReader();
                                                    reader.onload = async (evt) => {
                                                        try {
                                                            const data = new Uint8Array(evt.target.result);
                                                            const workbook = XLSX.read(data, { type: 'array' });
                                                            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                                                            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                                                            
                                                            // Assume header is on row 1, data starts row 2.
                                                            const headers = jsonData[0].map(h => h ? h.toString().toLowerCase() : '');
                                                            
                                                            // Find column indexes
                                                            const qIdx = headers.findIndex(h => h.includes('question'));
                                                            const aIdx = headers.findIndex(h => h.includes('option a') || h === 'a');
                                                            const bIdx = headers.findIndex(h => h.includes('option b') || h === 'b');
                                                            const cIdx = headers.findIndex(h => h.includes('option c') || h === 'c');
                                                            const dIdx = headers.findIndex(h => h.includes('option d') || h === 'd');
                                                            const correctIdx = headers.findIndex(h => h.includes('correct'));

                                                            if (qIdx === -1 || correctIdx === -1) {
                                                                toast.error('Invalid Excel format. Need at least "Question" and "Correct Option" columns.');
                                                                return;
                                                            }

                                                            const questionsToUpload = [];
                                                            for (let i = 1; i < jsonData.length; i++) {
                                                                const row = jsonData[i];
                                                                if (!row[qIdx]) continue; // Skip empty rows
                                                                
                                                                questionsToUpload.push({
                                                                    question_text: row[qIdx],
                                                                    option_a: row[aIdx] || '',
                                                                    option_b: row[bIdx] || '',
                                                                    option_c: row[cIdx] || '',
                                                                    option_d: row[dIdx] || '',
                                                                    correct_option: row[correctIdx] ? row[correctIdx].toString().trim().toUpperCase() : 'A'
                                                                });
                                                            }

                                                            if (questionsToUpload.length === 0) {
                                                                toast.warning('No questions found in file.');
                                                                return;
                                                            }

                                                            await apiClient.bulkAddQuestions(selectedQuizId, questionsToUpload);
                                                            toast.success(`Successfully uploaded ${questionsToUpload.length} questions!`);
                                                            handleSelectQuiz(selectedQuizId); // Refresh
                                                        } catch (error) {
                                                            toast.error('Failed to parse Excel file.');
                                                            console.error(error);
                                                        }
                                                        e.target.value = null; // Reset input
                                                    };
                                                    reader.readAsArrayBuffer(file);
                                                }}
                                            />
                                        </label>
                                        <button 
                                            onClick={() => setSelectedQuizId(null)}
                                            className="text-sm text-slate-500 hover:text-slate-900 font-medium px-2 py-1 bg-slate-100 rounded-lg border border-slate-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleAddQuestion} className="mb-6 space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden">
                                        <JoditEditor
                                            ref={editor}
                                            value={newQText}
                                            config={editorConfig}
                                            tabIndex={1}
                                            onBlur={newContent => setNewQText(newContent)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input type="text" placeholder="Option A" value={newQA} onChange={e => setNewQA(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 text-sm" />
                                        <input type="text" placeholder="Option B" value={newQB} onChange={e => setNewQB(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 text-sm" />
                                        <input type="text" placeholder="Option C" value={newQC} onChange={e => setNewQC(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 text-sm" />
                                        <input type="text" placeholder="Option D" value={newQD} onChange={e => setNewQD(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 text-sm" />
                                    </div>
                                    <div className="flex flex-col space-y-2 pt-2">
                                        <label className="text-sm text-slate-600 font-medium">Select Correct Option(s):</label>
                                        <div className="flex flex-wrap gap-3">
                                            {['A', 'B', 'C', 'D'].map(opt => {
                                                const currentArr = newQCorrect ? newQCorrect.split(',') : [];
                                                const isChecked = currentArr.includes(opt);
                                                return (
                                                    <label key={opt} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                        <input 
                                                            type="checkbox" 
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    currentArr.push(opt);
                                                                } else {
                                                                    const idx = currentArr.indexOf(opt);
                                                                    if (idx > -1) currentArr.splice(idx, 1);
                                                                }
                                                                setNewQCorrect(currentArr.sort().join(','));
                                                            }}
                                                        />
                                                        <span className="text-sm font-semibold">Option {opt}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 mt-4">
                                        <button type="submit" className="flex items-center justify-center w-full sm:w-auto space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                            {editingQuestionId ? <FaEdit /> : <FaPlus />} <span>{editingQuestionId ? 'Update Question' : 'Add Question'}</span>
                                        </button>
                                        {editingQuestionId && (
                                            <button type="button" onClick={resetQuestionForm} className="text-slate-500 hover:text-slate-700 text-sm font-medium px-3 py-2">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <div className="space-y-3">
                                    {questions.map((q, idx) => (
                                        <div key={q.id} className="p-4 bg-white rounded-lg text-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-medium text-slate-900 mb-1">Q{idx+1}:</p>
                                                <div 
                                                    className="jodit-content max-w-none text-slate-800 mb-2 border-l-4 border-blue-100 pl-3 py-1"
                                                    dangerouslySetInnerHTML={{ __html: q.question_text }}
                                                />
                                                <p className="text-xs text-slate-500">Correct: Option {q.correct_option}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 shrink-0">
                                                <button onClick={() => handleEditClick(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {questions.length === 0 && <p className="text-slate-500 text-sm py-2">No questions added yet.</p>}
                                </div>
                            </section>
                        )}
                    </div>

                </div>

                {/* Share Modal */}
            {shareModalQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-fade-in">
                        <button 
                            onClick={() => setShareModalQuiz(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center space-x-2">
                            <FaShareAlt className="text-indigo-500" />
                            <span>Share Quiz</span>
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">{shareModalQuiz.title}</p>

                        <div className="flex flex-col items-center space-y-6">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm inline-block">
                                <QRCodeSVG 
                                    value={shareToken ? `${window.location.origin}/quiz/${shareModalQuiz.id}?token=${shareToken}` : `${window.location.origin}/quiz/${shareModalQuiz.id}`}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="w-full">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                                    {shareToken ? 'One-Time Link' : 'Standard Link'}
                                </label>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={shareToken ? `${window.location.origin}/quiz/${shareModalQuiz.id}?token=${shareToken}` : `${window.location.origin}/quiz/${shareModalQuiz.id}`}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-l-lg px-3 py-2 text-sm text-slate-700 outline-none"
                                    />
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(shareToken ? `${window.location.origin}/quiz/${shareModalQuiz.id}?token=${shareToken}` : `${window.location.origin}/quiz/${shareModalQuiz.id}`);
                                            setLinkCopied(true);
                                            setTimeout(() => setLinkCopied(false), 2000);
                                        }}
                                        className="bg-indigo-50 hover:bg-indigo-100 border border-l-0 border-indigo-200 text-indigo-600 px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center min-w-[100px]"
                                    >
                                        {linkCopied ? <span className="text-xs font-bold">Copied!</span> : <><FaCopy className="mr-2" /> <span className="text-sm font-medium">Copy</span></>}
                                    </button>
                                </div>
                            </div>

                            {!shareToken && (
                                <div className="w-full pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-500 mb-3 text-center">Need a single-use link? Generate one below.</p>
                                    <button 
                                        onClick={handleGenerateOneTimeLink}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <span>Generate One-Time Link</span>
                                    </button>
                                </div>
                            )}

                            {shareToken && (
                                <div className="w-full pt-4 border-t border-slate-100">
                                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
                                        <strong>Important:</strong> This is a one-time link. As soon as a student uses this to start the quiz, the link will permanently expire. Do not share this specific link with multiple people.
                                    </div>
                                    <button 
                                        onClick={handleGenerateOneTimeLink}
                                        className="w-full mt-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 rounded-lg transition-colors text-sm"
                                    >
                                        Generate Another Link
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
