import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz() {
    const { quizId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                if (token) {
                    try {
                        await apiClient.validateQuizLink(quizId, token);
                    } catch (err) {
                        toast.error(err.message || 'Invalid or expired link');
                        navigate('/dashboard');
                        return;
                    }
                }

                const data = await apiClient.getQuestions(quizId, token);
                if (data.length === 0) {
                    toast.error('This quiz has no questions');
                    navigate('/dashboard');
                } else {
                    // Fisher-Yates shuffle to randomize questions for different students
                    for (let i = data.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [data[i], data[j]] = [data[j], data[i]];
                    }
                    setQuestions(data);
                }
            } catch (err) {
                toast.error('Failed to load quiz');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [quizId, navigate, token]);

    const handleSelectOption = (optionKey) => {
        const newAnswers = [...answers];
        const existingAnsIndex = newAnswers.findIndex(a => a.question_id === questions[currentIdx].id);
        
        if (existingAnsIndex >= 0) {
            let currentSelected = newAnswers[existingAnsIndex].selected_option;
            if (!Array.isArray(currentSelected)) {
                currentSelected = currentSelected ? [currentSelected] : [];
            }
            if (currentSelected.includes(optionKey)) {
                currentSelected = currentSelected.filter(k => k !== optionKey);
            } else {
                currentSelected.push(optionKey);
            }
            newAnswers[existingAnsIndex].selected_option = currentSelected;
        } else {
            newAnswers.push({
                question_id: questions[currentIdx].id,
                selected_option: [optionKey]
            });
        }
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        const currentAnswer = answers.find(a => a.question_id === questions[currentIdx].id)?.selected_option;
        if (!currentAnswer || currentAnswer.length === 0) {
            toast.warning('Please select at least one option before proceeding.');
            return;
        }

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    const handleSubmit = async () => {
        const currentAnswer = answers.find(a => a.question_id === questions[currentIdx].id)?.selected_option;
        if (!currentAnswer || currentAnswer.length === 0) {
            toast.warning('Please select at least one option before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            const formattedAnswers = answers.map(ans => ({
                ...ans,
                selected_option: Array.isArray(ans.selected_option) ? ans.selected_option.join(',') : ans.selected_option
            }));

            const result = await apiClient.submitQuiz(user.id, quizId, formattedAnswers, token);
            toast.success(`Quiz submitted! You scored ${result.score} out of ${result.total_questions}`);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Failed to submit quiz');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const currentQuestion = questions[currentIdx];
    
    // Safety guard if navigating away due to empty questions array
    if (!currentQuestion) {
        return null;
    }

    const currentAnswerObj = answers.find(a => a.question_id === currentQuestion.id)?.selected_option;
    const currentAnswerArr = Array.isArray(currentAnswerObj) ? currentAnswerObj : (currentAnswerObj ? [currentAnswerObj] : []);
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-2xl relative mt-4 md:mt-12">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-slate-500 text-xs mb-2 font-medium">
                        <span>Question {currentIdx + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% Completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm"
                    >
                        <div 
                            className="text-lg md:text-xl font-medium text-slate-900 mb-6 leading-relaxed jodit-content max-w-none"
                            dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}
                        />
                        <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-wider">Select all that apply</p>

                        <div className="space-y-3">
                            {['A', 'B', 'C', 'D'].map((opt) => {
                                const optionText = currentQuestion[`option_${opt.toLowerCase()}`];
                                const isSelected = currentAnswerArr.includes(opt);
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => handleSelectOption(opt)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center space-x-3 ${
                                            isSelected 
                                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                : 'border-slate-200 bg-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-7 h-7 rounded flex shrink-0 items-center justify-center font-semibold text-sm transition-colors ${
                                            isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {isSelected ? '✓' : opt}
                                        </div>
                                        <span className="flex-1 text-sm md:text-base">{optionText}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end items-center gap-3">
                    {currentIdx < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
