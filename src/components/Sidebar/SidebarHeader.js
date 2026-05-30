import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function SidebarHeader({ setIsOpen }) {
    return (
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-md">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white font-bold text-xl">S</span>
                </div>
                <h1 className="font-bold text-slate-800 text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    Student Portal
                </h1>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="md:hidden text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition-all"
            >
                <FaTimes />
            </button>
        </div>
    );
}
