import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

export default function LeaderboardPage() {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await apiClient.getGroupedLeaderboard();
                setLeaderboardData(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { global_top_5, quiz_by_quiz } = leaderboardData || { global_top_5: [], quiz_by_quiz: [] };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header Area */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-white shadow-lg shadow-amber-500/20">
                <div className="flex items-center space-x-4">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <FaTrophy className="text-4xl text-amber-100" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Global Leaderboard</h1>
                        <p className="text-amber-100 mt-1 opacity-90 text-sm">See the top performers across all quizzes and individual subjects.</p>
                    </div>
                </div>
            </div>

            {/* Global Top 5 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-bold text-slate-800 flex items-center">
                        <FaStar className="text-amber-500 mr-2" /> All Quizzes Top 5
                    </h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {global_top_5.map((entry, idx) => {
                        let rankStyle = "text-slate-500 bg-slate-100";
                        let rowStyle = "hover:bg-slate-50 transition-colors";
                        
                        if (idx === 0) {
                            rankStyle = "bg-amber-400 text-amber-900 shadow-sm shadow-amber-400/50";
                            rowStyle = "bg-amber-50/50 hover:bg-amber-50 border-l-4 border-amber-400";
                        } else if (idx === 1) {
                            rankStyle = "bg-slate-300 text-slate-800 shadow-sm shadow-slate-300/50";
                            rowStyle = "bg-slate-50 border-l-4 border-slate-300";
                        } else if (idx === 2) {
                            rankStyle = "bg-amber-700 text-amber-100 shadow-sm shadow-amber-700/50";
                            rowStyle = "bg-orange-50/30 border-l-4 border-amber-700";
                        }

                        return (
                            <div key={idx} className={`p-4 sm:px-6 flex items-center justify-between ${rowStyle}`}>
                                <div className="flex items-center space-x-4 sm:space-x-6">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${rankStyle}`}>
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{entry.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium">ID: {entry.index_number}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg sm:text-xl font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
                                        {entry.total_score} <span className="text-xs font-semibold text-blue-400 ml-1">PTS</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {global_top_5.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            No global leaderboard data available yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Quiz by Quiz Top 3 */}
            <h2 className="font-bold text-xl text-slate-900 pt-4 flex items-center">
                <FaMedal className="text-blue-500 mr-2" /> Quiz by Quiz Top 3
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quiz_by_quiz.map((quiz) => (
                    <div key={quiz.quiz_id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-blue-50/50">
                            <h3 className="font-bold text-slate-800 truncate">{quiz.title}</h3>
                        </div>
                        <div className="p-4 space-y-3 flex-1">
                            {quiz.top_performers.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 
                                            ${idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700 text-amber-100'}`}
                                        >
                                            #{idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 text-sm truncate">{entry.name}</p>
                                            <p className="text-xs text-slate-500 font-medium truncate">ID: {entry.index_number}</p>
                                        </div>
                                    </div>
                                    <div className="font-black text-blue-600 bg-white px-2 py-1 rounded-lg text-sm border border-slate-100 shrink-0 ml-2">
                                        {entry.score} <span className="text-[10px] text-blue-400">/{entry.total_questions}</span>
                                    </div>
                                </div>
                            ))}

                            {quiz.top_performers.length === 0 && (
                                <div className="text-center py-6 text-sm text-slate-400">
                                    No attempts yet.
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {quiz_by_quiz.length === 0 && (
                    <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
                        No quizzes available.
                    </div>
                )}
            </div>
        </div>
    );
}
