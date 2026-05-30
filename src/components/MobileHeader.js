import React from 'react';
import { FaBars } from 'react-icons/fa';

export default function MobileHeader({ setSidebarOpen }) {
    return (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 flex items-center justify-between z-20 shadow-sm">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="font-bold text-slate-800 text-lg">Student Portal</h1>
            </div>
            <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
                <FaBars className="text-xl" />
            </button>
        </div>
    );
}
