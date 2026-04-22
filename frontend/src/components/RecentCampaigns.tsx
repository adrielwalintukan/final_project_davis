import React, { useState, useEffect } from 'react';

interface Props {
  filters: { startDate: string; endDate: string; category?: string; mode: 'day' | 'month' | 'all' };
}

const badgeClass = (status: string) => {
  if (status === 'active') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
  return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25';
};

const RecentCampaigns: React.FC<Props> = ({ filters }) => {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    let url = "http://localhost:8000/api/campaigns/recent?";
    if (filters.category) url += `category=${filters.category}&`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((err) => console.error("Gagal mengambil data kampanye:", err));
  }, [filters]);

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-5 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-white">Transaksi Kampanye Terbaru</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Kampanye ID', 'Mulai', 'Kategori', 'Anggaran', 'Platform', 'Status'].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold uppercase text-[#55556a] px-3 pb-3 border-b border-white/5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((c) => (
                <tr key={c.id} className="group hover:bg-violet-500/5 transition-colors">
                  <td className="px-3 py-3 text-[12px] text-violet-400 font-medium">{c.id}</td>
                  <td className="px-3 py-3 text-[12px] text-[#9090b0]">{c.timestamp}</td>
                  <td className="px-3 py-3 text-[12px] text-[#9090b0] font-medium">{c.category}</td>
                  <td className="px-3 py-3 text-[12px] text-[#9090b0]">{c.spend}</td>
                  <td className="px-3 py-3 text-[12px] text-[#9090b0]">{c.region}</td>
                  <td className="px-3 py-3 border-b border-white/[0.03]">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${badgeClass(c.status)}`}>{c.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="py-10 text-center text-[#55556a] text-xs">Tidak ada data ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCampaigns;
