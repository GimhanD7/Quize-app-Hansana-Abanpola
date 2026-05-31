import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
    const [indexNumber, setIndexNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            navigate(String(user.is_admin) === '1' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!indexNumber.trim()) {
            toast.error('Please enter your Email Address');
            return;
        }

        setLoading(true);
        try {
            const data = await apiClient.login(indexNumber);
            if (data.needs_registration) {
                toast.info(data.error);
                navigate('/register', { state: { indexNumber } });
            } else if (data.user) {
                toast.success('Login successful!');
                login(data.user);
                navigate(String(data.user.is_admin) === '1' ? '/admin' : '/dashboard');
            }
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 transition-colors duration-300">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-xl shadow-sm"
            >
                <div className="flex flex-col items-start mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="text"
                            value={indexNumber}
                            onChange={(e) => setIndexNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="name@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            'Continue'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
