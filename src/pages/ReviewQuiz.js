import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';

export default function ReviewQuiz() {
    const { quizId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const data = await apiClient.getQuizReview(user.id, quizId);
                if (data.error) throw new Error(data.error);
                setReviewData(data);
            } catch (err) {
                console.error("Failed to fetch review", err);
                setError(err.message || 'Failed to load quiz review.');
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [user.id, quizId]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !reviewData) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500 font-semibold mb-4">{error}</p>
                <button onClick={() => navigate('/history')} className="text-blue-600 hover:underline">
                    Back to History
                </button>
            </div>
        );
    }

    const { quiz, questions } = reviewData;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
            <button 
                onClick={() => navigate('/history')}
                className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm mb-2"
            >
                <FaArrowLeft className="mr-2" /> Back to History
            </button>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">{quiz.title} - Review</h1>
                <p className="text-slate-500 mt-1">{quiz.description}</p>
                
                <div className="mt-6 flex items-center space-x-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-1">
                        <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Your Score</p>
                        <p className="text-3xl font-bold text-blue-700">{quiz.score} <span className="text-lg text-blue-400">/ {quiz.total_questions}</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
                        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Completed</p>
                        <p className="text-base font-bold text-slate-800">{new Date(quiz.completed_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((q, index) => {
                    const selectedArr = q.selected_option ? q.selected_option.split(',') : [];
                    const correctArr = q.correct_option ? q.correct_option.split(',') : [];
                    
                    // A question is fully correct if the selected array exactly matches the correct array
                    const isCorrect = selectedArr.slice().sort().join(',') === correctArr.slice().sort().join(',');
                    const isUnanswered = selectedArr.length === 0;

                    return (
                        <div key={q.question_id} className={`bg-white border p-6 rounded-2xl shadow-sm ${isCorrect ? 'border-emerald-200' : 'border-red-200'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 overflow-hidden mr-4">
                                    <div className="flex items-start">
                                        <span className="text-slate-400 mr-2 mt-1 font-semibold text-lg">{index + 1}.</span>
                                        <div 
                                            className="text-lg font-semibold text-slate-900 jodit-content max-w-none"
                                            dangerouslySetInnerHTML={{ __html: q.question_text }}
                                        />
                                    </div>
                                </div>
                                {isCorrect ? (
                                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center shrink-0 ml-4">
                                        <FaCheck className="mr-1" /> Correct
                                    </div>
                                ) : (
                                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center shrink-0 ml-4">
                                        <FaTimes className="mr-1" /> {isUnanswered ? 'Skipped' : 'Incorrect'}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['A', 'B', 'C', 'D'].map(opt => {
                                    const optionText = q[`option_${opt.toLowerCase()}`];
                                    const isSelected = selectedArr.includes(opt);
                                    const isActualCorrect = correctArr.includes(opt);
                                    
                                    let optionClass = "border-slate-200 bg-slate-50 text-slate-700";
                                    let icon = null;

                                    if (isActualCorrect && isSelected) {
                                        optionClass = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500";
                                        icon = <FaCheck className="text-emerald-500 ml-auto" />;
                                    } else if (isActualCorrect && !isSelected) {
                                        // Missed correct option
                                        optionClass = "border-amber-400 bg-amber-50 text-amber-800 border-dashed border-2";
                                        icon = <span className="text-xs font-bold text-amber-600 ml-auto tracking-wider uppercase">Missed</span>;
                                    } else if (isSelected && !isActualCorrect) {
                                        // Wrong option selected
                                        optionClass = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500";
                                        icon = <FaTimes className="text-red-500 ml-auto" />;
                                    }

                                    return (
                                        <div key={opt} className={`p-4 rounded-xl border-2 flex items-center transition-colors ${optionClass}`}>
                                            <span className="font-bold mr-3 opacity-60">{opt}.</span>
                                            <span>{optionText}</span>
                                            {icon}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
