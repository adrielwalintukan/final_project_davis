import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-900/20 bg-[#14141f] shrink-0">
      {/* Title */}
      <div className="font-['Space_Grotesk'] text-xl font-bold leading-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
        Ad Campaign<br />Intelligence
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-[280px]">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#55556a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search campaigns, metrics..."
          className="w-full bg-[#1e1e30] border border-purple-900/20 rounded-lg pl-8 pr-3 py-2 text-[13px] text-white placeholder-[#55556a] outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e30] border border-purple-900/20 rounded-lg text-[12px] text-[#9090b0] hover:border-violet-500 hover:text-white transition-all cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Last 30 Days
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e30] border border-purple-900/20 rounded-lg text-[12px] text-[#9090b0] hover:border-violet-500 hover:text-white transition-all cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
            <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
          </svg>
          All Categories
        </button>

        {/* Icon Buttons */}
        <button className="w-9 h-9 flex items-center justify-center bg-[#1e1e30] border border-purple-900/20 rounded-lg text-[#9090b0] hover:border-violet-500 hover:text-white transition-all cursor-pointer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <button className="w-9 h-9 flex items-center justify-center bg-[#1e1e30] border border-purple-900/20 rounded-lg text-[#9090b0] hover:border-violet-500 hover:text-white transition-all cursor-pointer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15H4.5A1.65 1.65 0 0 0 3 13.5V12a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 8.6 13.4"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
