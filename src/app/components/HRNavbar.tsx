import React from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Menu, Search } from 'lucide-react';

interface HRNavbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
}

export function HRNavbar({ isSidebarOpen, setSidebarOpen, title }: HRNavbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white dark:bg-gray-950 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-8 flex items-center justify-between z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-64">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none w-full"
          />
        </div>
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{user.role}</p>
          </div>
          <DarkModeToggle />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B0BF00] to-[#D4E200] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
