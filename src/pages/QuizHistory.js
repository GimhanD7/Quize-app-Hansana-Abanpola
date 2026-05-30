import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

export default function QuizHistory() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await apiClient.getUserResults(user.id);
                setResults(data);
            } catch (err) {
                console.error("Failed to fetch quiz history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                        <FaCheckCircle className="text-emerald-500 mr-3" />
                        Quiz History
                    </h1>
                    <p className="text-slate-500 mt-1">Review your past attempts and scores</p>
                </div>
            </div>

            <div className="space-y-4">
                {results.map((result, idx) => (
                    <div 
                        key={idx} 
                        className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                        onClick={() => navigate(`/review/${result.quiz_id}`)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg border border-emerald-100">
                                {result.score}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{result.title}</h3>
                                <p className="text-sm text-slate-500">
                                    Completed on {new Date(result.completed_at).toLocaleDateString()} at {new Date(result.completed_at).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center text-blue-600 font-semibold text-sm">
                            <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">View Review</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                ))}

                {results.length === 0 && (
                    <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 shadow-sm">
                        <FaCheckCircle className="text-4xl text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-slate-900">No quizzes completed yet</h3>
                        <p className="text-slate-500 mt-1">Go to your dashboard to start taking quizzes!</p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
