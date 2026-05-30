import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MobileHeader from './MobileHeader';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 transition-colors duration-300 flex overflow-hidden">
            {/* Mobile Header */}
            <MobileHeader setSidebarOpen={setSidebarOpen} />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 w-full pt-16 md:pt-0 h-screen overflow-y-auto">
                <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto min-h-full flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex-1 bg-white md:rounded-3xl md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border md:border-slate-100 p-4 md:p-8"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
