import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { FaPlay, FaTrophy, FaCheckCircle } from 'react-icons/fa';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [quizzes, setQuizzes] = useState([]);
    const [results, setResults] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quizzesData, resultsData, leaderboardData] = await Promise.all([
                    apiClient.getQuizzes(),
                    apiClient.getUserResults(user.id),
                    apiClient.getLeaderboard()
                ]);
                setQuizzes(quizzesData);
                setResults(resultsData);
                setLeaderboard(leaderboardData);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const completedQuizIds = results.map(r => r.quiz_id || r.title); // api logic: need to ensure results map back accurately. We just map completed titles for now.

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name} 👋</h1>
                <p className="text-slate-500 mt-1">Here's your academic dashboard</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content (Quizzes & Results) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Available Quizzes */}
                        <section>
                            <h2 className="text-lg font-semibold mb-3 text-slate-900 flex items-center">
                                <span className="text-blue-500 mr-2"><FaPlay /></span>
                                Available Quizzes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quizzes.filter(q => q.is_public == 1 && !results.find(r => r.quiz_id === q.id)).map((quiz) => (
                                    <div 
                                        key={quiz.id} 
                                        className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between shadow-sm"
                                    >
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900 mb-2">{quiz.title}</h3>
                                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                ))}
                                {quizzes.filter(q => q.is_public == 1 && !results.find(r => r.quiz_id === q.id)).length === 0 && (
                                    <div className="col-span-full bg-white p-6 rounded-xl text-center border border-slate-200 shadow-sm">
                                        <p className="text-slate-500 text-sm">No new quizzes available right now.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Past Results */}
                        <section>
                            <h2 className="text-lg font-semibold mb-3 text-slate-900 flex items-center">
                                <span className="text-emerald-500 mr-2"><FaCheckCircle /></span>
                                Completed Quizzes
                            </h2>
                            <div className="space-y-3">
                                {results.map((result, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">{result.title}</h3>
                                            <p className="text-xs text-slate-500">Completed on {new Date(result.completed_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-emerald-600">
                                                    {result.score} <span className="text-xs text-slate-400">/ {result.total_questions}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/review/${result.quiz_id}`)}
                                                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                                            >
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {results.length === 0 && (
                                    <div className="bg-white p-6 rounded-xl text-center border border-slate-200 shadow-sm">
                                        <p className="text-slate-500 text-sm">You haven't completed any quizzes yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar (Leaderboard) */}
                    <div className="lg:col-span-1">
                        <section className="bg-white border border-slate-200 p-5 rounded-xl sticky top-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4 text-slate-900 flex items-center">
                                <span className="text-amber-500 mr-2"><FaTrophy /></span>
                                Global Leaderboard
                            </h2>
                            <div className="space-y-2">
                                {leaderboard.map((entry, idx) => (
                                    <div key={idx} className={`flex items-center justify-between p-2.5 rounded-lg border ${idx === 0 ? 'bg-amber-50 border-amber-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}>
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-amber-700 text-amber-50' : 'bg-slate-100 text-slate-500'}`}>
                                                {idx + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900 text-sm truncate">{entry.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{entry.institute_name}</p>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-blue-600 text-sm whitespace-nowrap ml-2">
                                            {entry.total_score}
                                        </div>
                                    </div>
                                ))}
                                {leaderboard.length === 0 && (
                                    <p className="text-slate-500 text-center text-sm py-4">No leaderboard data yet.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
        </div>
    );
}
