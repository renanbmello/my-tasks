"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useState, useEffect } from 'react'; 
import { useTheme } from '@/contexts/ThemeContext'; 

const navLinks = [
  { name: 'Today', href: '/' },
  { name: 'Week', href: '/week' },
  { name: 'Month', href: '/month' },
];

const AppHeader = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50 dark:bg-gray-800 transition-colors duration-300">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/today" className="text-2xl font-bold hover:text-indigo-200 dark:hover:text-indigo-300">
            MyTasks
          </Link>
          
          <div className="flex items-center space-x-3">
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (pathname === '/' && link.href === '/today');
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium 
                                ${isActive 
                                  ? 'bg-indigo-700 text-white dark:bg-indigo-500' 
                                  : 'text-indigo-100 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700'}
                              `}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            

            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-indigo-100 hover:text-white dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-gray-500 p-2 rounded-md"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-1 pb-2">
            {navLinks.map((link) => {
               const isActive = pathname === link.href || (pathname === '/' && link.href === '/today');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium 
                              ${isActive 
                                ? 'bg-indigo-700 text-white dark:bg-indigo-500' 
                                : 'text-indigo-100 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700'}
                            `}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
};

export default AppHeader; 