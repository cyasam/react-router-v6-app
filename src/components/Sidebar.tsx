import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    const initial = saved ? JSON.parse(saved) : false;
    return initial;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  const handleToggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
  };

  return (
    <div className="w-88 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col relative transition-colors">
      <div className="px-8 py-4 flex justify-center">
        <h1 className="flex items-center text-xl font-medium m-0 leading-none text-slate-900 dark:text-slate-100">
          <span className="mr-2">🚀</span>
          React Router Contacts
        </h1>
      </div>

      <nav role="navigation" className="flex-1 overflow-auto px-8 pt-4">
        <ul className="p-0 m-0 list-none">
          <li className="my-1">
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                `flex items-center justify-between overflow-hidden whitespace-pre px-2 py-2 rounded-lg no-underline gap-4 font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white dark:text-slate-900'
                    : isPending
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink
              to="/contacts"
              className={({ isActive, isPending }) =>
                `flex items-center justify-between overflow-hidden whitespace-pre px-2 py-2 rounded-lg no-underline gap-4 font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white dark:text-slate-900'
                    : isPending
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`
              }
            >
              Contacts
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={handleToggle}
          type="button"
          aria-label="Toggle dark mode"
          className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-full w-12 h-12 text-2xl cursor-pointer flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 hover:shadow-lg active:scale-95"
        >
          {isDark ? '🌞' : '🌙'}
        </button>
      </div>
    </div>
  );
}
