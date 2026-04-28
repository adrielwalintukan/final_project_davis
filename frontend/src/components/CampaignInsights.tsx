import React, { useState, useEffect } from "react";

interface Campaign {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_budget: number;
  platform: string;
  ad_type: string;
  total_ads: number;
  impressions: number;
  clicks: number;
  purchases: number;
  unique_users: number;
  ctr: number;
  cvr: number;
  status: string;
}

interface CampaignDetail {
  campaign: any;
  events: any;
  platforms: any[];
  metrics: any;
}

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
    status === "active"
      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
      : "bg-[#2a2a3e] text-[#55556a] border border-purple-900/20"
  }`}>
    {status === "active" ? "Aktif" : "Selesai"}
  </span>
);

const StatChip = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex flex-col items-center px-3 py-2 bg-[#0f0f1a] rounded-lg border border-purple-900/20">
    <span className={`text-[13px] font-bold ${accent ? "text-violet-400" : "text-white"}`}>{value}</span>
    <span className="text-[10px] text-[#55556a] mt-0.5 uppercase tracking-wide">{label}</span>
  </div>
);

import MetricCard from "./MetricCard";

const IconKampanye = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>;
const IconAktif = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>;
const IconBudget = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconCTR = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M2 20h20M6 20V10M12 20V4M18 20v-8"/></svg>;

const CampaignInsights: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<CampaignDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/campaigns/all?sort_by=start_date&sort_dir=desc")
      .then(r => r.json())
      .then(data => { setCampaigns(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = async (id: number) => {
    if (selected === id) { setSelected(null); setDetail(null); return; }
    setSelected(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/campaigns/${id}/detail`);
      const data = await res.json();
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = campaigns.filter(c => filter === "all" || c.status === filter);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-5 flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Space_Grotesk'] text-xl font-bold text-white">Campaign Insights</h1>
          <p className="text-[12px] text-[#55556a] mt-0.5">Klik kampanye untuk melihat detail performa</p>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "active", "completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                filter === f
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                  : "text-[#55556a] border-purple-900/20 hover:text-white hover:bg-[#1a1a2e]"
              }`}
            >
              {f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Kampanye", value: filtered.length.toString(), icon: IconKampanye },
          { label: filter === "completed" ? "Selesai" : "Sedang Aktif", value: filtered.filter(c => c.status === (filter === "completed" ? "completed" : "active")).length.toString(), icon: IconAktif },
          { label: "Total Budget", value: `$${filtered.reduce((s,c) => s + c.total_budget, 0).toLocaleString(undefined, {maximumFractionDigits: 0})}`, icon: IconBudget },
          { label: "Avg CTR", value: `${filtered.length ? (filtered.reduce((s,c) => s + c.ctr, 0) / filtered.length).toFixed(2) : 0}%`, icon: IconCTR },
        ].map(s => (
          <MetricCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Campaign Cards */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[#55556a] text-sm">Memuat kampanye...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(c => (
            <div key={c.id}>
              {/* Card */}
              <div
                onClick={() => handleSelect(c.id)}
                className={`bg-[#14141f] border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selected === c.id
                    ? "border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "border-purple-900/20 hover:border-purple-500/40 hover:bg-[#16162a]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Left: ID + Name */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-700/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-violet-400">#{c.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-semibold text-white truncate">{c.name}</h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="flex gap-3 text-[11px] text-[#55556a]">
                      <span>📅 {c.start_date} → {c.end_date}</span>
                      <span>🖥 {c.platform}</span>
                      <span>📢 {c.ad_type}</span>
                    </div>
                  </div>
                  {/* Right: Stats */}
                  <div className="flex gap-2 shrink-0">
                    <StatChip label="Budget" value={`$${c.total_budget.toLocaleString(undefined, {maximumFractionDigits: 0})}`} />
                    <StatChip label="CTR" value={`${c.ctr ?? 0}%`} accent />
                    <StatChip label="CVR" value={`${c.cvr ?? 0}%`} accent />
                    <StatChip label="Klik" value={c.clicks.toLocaleString()} />
                  </div>
                  {/* Chevron */}
                  <svg className={`w-4 h-4 text-[#55556a] transition-transform shrink-0 ${selected === c.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {/* Detail Panel */}
              {selected === c.id && (
                <div className="mt-1 bg-[#0f0f1a] border border-violet-500/20 rounded-xl p-4 animate-fade-up">
                  {detailLoading ? (
                    <div className="text-center text-[12px] text-[#55556a] py-4">Memuat detail...</div>
                  ) : detail ? (
                    <div className="flex gap-6">
                      {/* Metrik */}
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-[#55556a] font-semibold mb-3">Metrik Performa</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Impresi", value: detail.metrics.impressions.toLocaleString() },
                            { label: "Klik", value: detail.metrics.clicks.toLocaleString() },
                            { label: "Konversi", value: detail.metrics.purchases.toLocaleString() },
                            { label: "CTR", value: `${detail.metrics.ctr}%`, accent: true },
                            { label: "CVR", value: `${detail.metrics.cvr}%`, accent: true },
                            { label: "Budget", value: `$${detail.campaign.total_budget.toLocaleString()}` },
                          ].map(m => (
                            <div key={m.label} className="bg-[#14141f] rounded-lg p-2.5 border border-purple-900/20">
                              <p className="text-[10px] text-[#55556a]">{m.label}</p>
                              <p className={`text-[14px] font-bold mt-0.5 ${m.accent ? "text-violet-400" : "text-white"}`}>{m.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Platform Breakdown */}
                      <div className="w-56 shrink-0">
                        <p className="text-[10px] uppercase tracking-widest text-[#55556a] font-semibold mb-3">Platform & Tipe</p>
                        <div className="flex flex-col gap-2">
                          {detail.platforms.map((p: any, i: number) => (
                            <div key={i} className="bg-[#14141f] rounded-lg p-2.5 border border-purple-900/20">
                              <div className="flex justify-between items-center">
                                <span className="text-[12px] text-[#c0c0d8] font-semibold">{p.platform}</span>
                                <span className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">{p.type}</span>
                              </div>
                              <div className="flex gap-3 mt-1 text-[10px] text-[#55556a]">
                                <span>{p.total_ads} iklan</span>
                                <span>{p.clicks} klik</span>
                                <span>{p.purchases} beli</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#55556a] text-sm">Tidak ada kampanye ditemukan.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignInsights;
