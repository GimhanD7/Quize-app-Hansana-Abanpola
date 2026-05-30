import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function Register() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        indexNumber: location.state?.indexNumber || '',
        name: '',
        instituteName: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { indexNumber, name, instituteName } = formData;
        
        if (!indexNumber.trim() || !name.trim() || !instituteName.trim()) {
            toast.error('All fields are required');
            return;
        }

        setLoading(true);
        try {
            const data = await apiClient.register(indexNumber, name, instituteName);
            toast.success('Registration successful!');
            if (data.user) {
                login(data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 transition-colors duration-300">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-xl shadow-sm"
            >
                <div className="flex flex-col items-start mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Complete Registration
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Please provide your details to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Index Number
                        </label>
                        <input
                            type="text"
                            name="indexNumber"
                            value={formData.indexNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Index Number"
                            readOnly={!!location.state?.indexNumber}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Institute Name
                        </label>
                        <input
                            type="text"
                            name="instituteName"
                            value={formData.instituteName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="University of ABC"
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
                            'Register & Login'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
