import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  changeLabel: string;
  icon: React.ReactNode;
  bars: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({
  label, value, change, changeType, changeLabel, icon, bars,
}) => {
  const maxBar = Math.max(...bars);
  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-4 flex flex-col gap-2 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:-translate-y-0.5 transition-all duration-250 cursor-default animate-fade-up">
      {/* Label */}
      <div className="flex items-center justify-between text-[10px] font-semibold tracking-widest uppercase text-[#55556a]">
        {label}
        <span className="w-3.5 h-3.5 text-[#55556a]">{icon}</span>
      </div>

      {/* Value */}
      <div className="font-['Space_Grotesk'] text-2xl font-bold text-white leading-none">{value}</div>

      {/* Change */}
      <div className={`flex items-center gap-1.5 text-[11px] font-medium ${changeType === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
        {changeType === 'up' ? (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
        ) : (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
          </svg>
        )}
        {change}
        <span className="text-[#55556a] font-normal">{changeLabel}</span>
      </div>

      {/* Mini Bar Chart */}
      <div className="flex items-end gap-[3px] h-8 mt-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-colors duration-200 ${h === maxBar ? 'bg-violet-500' : 'bg-violet-500/20'}`}
            style={{ height: `${(h / maxBar) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricCard;
