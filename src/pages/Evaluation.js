import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { FaChartBar, FaChartLine, FaCheckDouble, FaCrosshairs } from 'react-icons/fa';

export default function Evaluation() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await apiClient.getUserResults(user.id);
                setResults(data);
            } catch (err) {
                console.error("Failed to fetch evaluation data", err);
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

    // Calculate metrics
    const totalQuizzes = results.length;
    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    const totalQuestions = results.reduce((acc, curr) => acc + curr.total_questions, 0);
    const averageScore = totalQuizzes > 0 ? (totalScore / totalQuestions * 100).toFixed(1) : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                    <FaChartBar className="text-blue-500 mr-3" />
                    Performance Evaluation
                </h1>
                <p className="text-slate-500 mt-1">An overview of your academic progress.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100">
                        <FaCheckDouble />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Quizzes Taken</p>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">{totalQuizzes}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl border border-emerald-100">
                        <FaChartLine />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Score</p>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">{totalScore} <span className="text-lg text-slate-400">/ {totalQuestions}</span></h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl border border-indigo-100">
                        <FaCrosshairs />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Accuracy</p>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">{averageScore}%</h2>
                    </div>
                </div>
            </div>

            {/* Detailed Evaluation list */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mt-8">
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Recent Quiz Performance</h2>
                {results.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No evaluation data yet. Complete a quiz to see your performance.</p>
                ) : (
                    <div className="space-y-4">
                        {results.map((result, idx) => {
                            const percent = (result.score / result.total_questions) * 100;
                            let barColor = "bg-red-500";
                            if (percent >= 80) barColor = "bg-emerald-500";
                            else if (percent >= 50) barColor = "bg-amber-500";

                            return (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold text-slate-900">{result.title}</h3>
                                        <span className="font-bold text-slate-700 text-sm">{result.score} / {result.total_questions}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                                        <span>Completed: {new Date(result.completed_at).toLocaleDateString()}</span>
                                        <span>{percent.toFixed(0)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
