import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

export default function SidebarProfile() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="p-5 border-t border-slate-200/60 bg-white/30 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
                        <span className="text-blue-700 font-bold uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-slate-800 text-sm truncate">{user?.name}</span>
                        <span className="text-xs text-slate-500 font-medium truncate">{user?.index_number}</span>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl transition-all duration-300 text-sm font-bold border border-red-100 hover:border-red-500 hover:shadow-md hover:shadow-red-500/20 group"
                >
                    <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> 
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
