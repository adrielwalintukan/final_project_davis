import React from 'react';

const campaigns = [
  { id: '#AD-9042', timestamp: 'Apr 20, 2024', category: 'Social Media', spend: '$12,402.00', region: 'Jakarta',  status: 'active' },
  { id: '#AD-9041', timestamp: 'Apr 18, 2024', category: 'Search Ads',   spend: '$8,750.00',  region: 'Surabaya', status: 'active' },
  { id: '#AD-9040', timestamp: 'Apr 15, 2024', category: 'Display Ads',  spend: '$5,230.00',  region: 'Bandung',  status: 'paused' },
  { id: '#AD-9039', timestamp: 'Apr 12, 2024', category: 'Video Ads',    spend: '$3,890.00',  region: 'Medan',    status: 'completed' },
  { id: '#AD-9038', timestamp: 'Apr 10, 2024', category: 'Social Media', spend: '$9,100.00',  region: 'Bali',     status: 'active' },
];

const badgeClass = (status: string) => {
  if (status === 'active')    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
  if (status === 'paused')    return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25';
  return 'bg-violet-500/10 text-violet-400 border border-violet-500/25';
};

const RecentCampaigns: React.FC = () => {
  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-white">Recent Campaign Transactions</div>
        <a href="#" className="flex items-center gap-1 text-[12px] text-violet-400 hover:opacity-70 transition-opacity">
          View Full Archive
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Campaign ID', 'Timestamp', 'Category', 'Ad Spend', 'Region', 'Status'].map((h) => (
              <th key={h} className="text-left text-[10px] font-semibold tracking-widest uppercase text-[#55556a] px-3 pb-3 border-b border-white/5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="group hover:bg-violet-500/5 transition-colors">
              <td className="px-3 py-3 text-[12px] text-violet-400 font-medium font-['Space_Grotesk'] border-b border-white/[0.03]">{c.id}</td>
              <td className="px-3 py-3 text-[12px] text-[#9090b0] group-hover:text-white border-b border-white/[0.03] transition-colors">{c.timestamp}</td>
              <td className="px-3 py-3 text-[12px] text-[#9090b0] group-hover:text-white border-b border-white/[0.03] transition-colors">{c.category}</td>
              <td className="px-3 py-3 text-[12px] text-[#9090b0] group-hover:text-white border-b border-white/[0.03] transition-colors">{c.spend}</td>
              <td className="px-3 py-3 text-[12px] text-[#9090b0] group-hover:text-white border-b border-white/[0.03] transition-colors">{c.region}</td>
              <td className="px-3 py-3 border-b border-white/[0.03]">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${badgeClass(c.status)}`}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentCampaigns;
