import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarProfile from './SidebarProfile';

export default function Sidebar({ isOpen, setIsOpen }) {
    return (
        <aside 
            className={`fixed inset-y-0 left-0 w-72 bg-white/70 backdrop-blur-xl border-r border-slate-200/60 
            transform ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
            md:translate-x-0 md:shadow-none transition-all duration-400 ease-out z-40 flex flex-col`}
        >
            <SidebarHeader setIsOpen={setIsOpen} />
            <SidebarNav setIsOpen={setIsOpen} />
            <SidebarProfile />
        </aside>
    );
}
