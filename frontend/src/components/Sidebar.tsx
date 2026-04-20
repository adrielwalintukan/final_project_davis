import React from "react";

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

const navItems = [
  {
    id: "command",
    label: "Command Deck",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "insights",
    label: "Campaign Insights",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: "streams",
    label: "Data Streams",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "archives",
    label: "Archives",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
  {
    id: "config",
    label: "System Configuration",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="20" y2="12" />
        <line x1="12" y1="18" x2="20" y2="18" />
      </svg>
    ),
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange }) => {
  return (
    <aside className="w-[210px] min-w-[210px] bg-[#0d0d18] border-r border-purple-900/20 flex flex-col py-5 z-10">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 pb-5 mb-3 border-b border-purple-900/20">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-base shadow-[0_0_12px_rgba(139,92,246,0.4)] shrink-0">
          📊
        </div>
        <div>
          <p className="font-['Space_Grotesk'] text-xs font-semibold text-white tracking-wide">
            Intelijen Iklan
          </p>
          <p className="text-[9px] text-violet-400 tracking-[1.5px] uppercase">
            Sesi Aktif
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-left border transition-all duration-200 cursor-pointer w-full
              ${
                activeNav === item.id
                  ? "bg-gradient-to-r from-violet-500/20 to-purple-700/10 text-violet-300 border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                  : "text-[#9090b0] border-transparent hover:bg-[#1a1a2e] hover:text-white hover:border-purple-900/20"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
