import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlay, FaUserCog, FaCheckCircle, FaTrophy, FaChartBar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function SidebarNav({ setIsOpen }) {
    const { user } = useAuth();

    return (
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <NavLink 
                to="/dashboard" 
                end
                className={({ isActive }) => 
                    `relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold group
                    ${isActive ? 'text-blue-700 bg-blue-50/80 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
                onClick={() => setIsOpen(false)}
            >
                {({ isActive }) => (
                    <>
                        <FaPlay className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                        <span>Dashboard</span>
                        {isActive && (
                            <motion.div 
                                layoutId="sidebar-active-indicator"
                                className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </>
                )}
            </NavLink>

            <NavLink 
                to="/history" 
                className={({ isActive }) => 
                    `relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold group
                    ${isActive ? 'text-blue-700 bg-blue-50/80 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
                onClick={() => setIsOpen(false)}
            >
                {({ isActive }) => (
                    <>
                        <FaCheckCircle className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                        <span>Past Quizzes</span>
                        {isActive && (
                            <motion.div 
                                layoutId="sidebar-active-indicator"
                                className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </>
                )}
            </NavLink>

            <NavLink 
                to="/evaluation" 
                className={({ isActive }) => 
                    `relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold group
                    ${isActive ? 'text-blue-700 bg-blue-50/80 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
                onClick={() => setIsOpen(false)}
            >
                {({ isActive }) => (
                    <>
                        <FaChartBar className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                        <span>Evaluation</span>
                        {isActive && (
                            <motion.div 
                                layoutId="sidebar-active-indicator"
                                className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </>
                )}
            </NavLink>

            <NavLink 
                to="/leaderboard" 
                className={({ isActive }) => 
                    `relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold group
                    ${isActive ? 'text-blue-700 bg-blue-50/80 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
                onClick={() => setIsOpen(false)}
            >
                {({ isActive }) => (
                    <>
                        <FaTrophy className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                        <span>Leaderboard</span>
                        {isActive && (
                            <motion.div 
                                layoutId="sidebar-active-indicator"
                                className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </>
                )}
            </NavLink>

            {user?.is_admin == 1 && (
                <NavLink 
                    to="/admin" 
                    className={({ isActive }) => 
                        `relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold group
                        ${isActive ? 'text-blue-700 bg-blue-50/80 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                    }
                    onClick={() => setIsOpen(false)}
                >
                    {({ isActive }) => (
                        <>
                            <FaUserCog className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                            <span>Admin Panel</span>
                            {isActive && (
                                <motion.div 
                                    layoutId="sidebar-active-indicator"
                                    className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </>
                    )}
                </NavLink>
            )}
        </nav>
    );
}
