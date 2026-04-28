import React, { useState, useEffect, useCallback } from "react";

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

type SortKey = "start_date" | "budget" | "name" | "duration" | "ctr" | "cvr";

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
    status === "active"
      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
      : "bg-[#2a2a3e] text-[#55556a] border border-purple-900/20"
  }`}>
    {status === "active" ? "Aktif" : "Selesai"}
  </span>
);

const Archives: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("start_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = useCallback(() => {
    setLoading(true);
    let url = `http://localhost:8000/api/campaigns/all?sort_by=${sortBy}&sort_dir=${sortDir}`;
    if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
    if (statusFilter !== "all") url += `&status_filter=${statusFilter}`;
    fetch(url)
      .then(r => r.json())
      .then(data => { setCampaigns(data); setPage(1); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sortBy, sortDir, debouncedSearch, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-1 text-[10px] ${sortBy === col ? "text-violet-400" : "text-[#333350]"}`}>
      {sortBy === col ? (sortDir === "desc" ? "▼" : "▲") : "⇅"}
    </span>
  );

  const paginated = campaigns.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(campaigns.length / PER_PAGE);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-5 flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Space_Grotesk'] text-xl font-bold text-white">Archives</h1>
          <p className="text-[12px] text-[#55556a] mt-0.5">
            {campaigns.length} kampanye ditemukan
          </p>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["all", "active", "completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                statusFilter === f
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                  : "text-[#55556a] border-purple-900/20 hover:text-white hover:bg-[#1a1a2e]"
              }`}
            >
              {f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#55556a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama kampanye..."
          className="w-full bg-[#14141f] border border-purple-900/20 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-white placeholder-[#55556a] outline-none focus:border-violet-500 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-white cursor-pointer">✕</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#14141f] border border-purple-900/20 rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-purple-900/20 bg-[#0f0f1a]">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold">#</th>
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold cursor-pointer hover:text-violet-400 transition-colors select-none"
                  onClick={() => toggleSort("name")}
                >Nama Kampanye <SortIcon col="name" /></th>
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold cursor-pointer hover:text-violet-400 transition-colors select-none"
                  onClick={() => toggleSort("start_date")}
                >Tanggal <SortIcon col="start_date" /></th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold">Platform</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold">Tipe</th>
                <th
                  className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold cursor-pointer hover:text-violet-400 transition-colors select-none"
                  onClick={() => toggleSort("budget")}
                >Budget <SortIcon col="budget" /></th>
                <th
                  className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold cursor-pointer hover:text-violet-400 transition-colors select-none"
                  onClick={() => toggleSort("ctr")}
                >CTR <SortIcon col="ctr" /></th>
                <th
                  className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold cursor-pointer hover:text-violet-400 transition-colors select-none"
                  onClick={() => toggleSort("cvr")}
                >CVR <SortIcon col="cvr" /></th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold">Klik</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-[#55556a] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="text-center py-12 text-[#55556a]">Memuat data...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-[#55556a]">Tidak ada data ditemukan.</td></tr>
              ) : paginated.map((c, idx) => (
                <tr key={c.id} className="border-b border-purple-900/10 hover:bg-[#1a1a2e] transition-colors">
                  <td className="px-4 py-3 text-[#55556a] font-mono">{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{c.name}</span>
                      <span className="text-[10px] text-[#55556a]">{c.duration_days} hari · {c.total_ads} iklan</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9090b0]">
                    <div className="flex flex-col">
                      <span>{c.start_date}</span>
                      <span className="text-[10px] text-[#55556a]">→ {c.end_date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-mono">{c.platform}</span>
                  </td>
                  <td className="px-4 py-3 text-[#9090b0]">{c.ad_type}</td>
                  <td className="px-4 py-3 text-right text-white font-mono font-semibold">${c.total_budget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-violet-400 font-mono font-semibold">{c.ctr ?? 0}%</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-violet-400 font-mono font-semibold">{c.cvr ?? 0}%</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#9090b0] font-mono">{c.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-purple-900/20 bg-[#0f0f1a] mt-auto">
            <span className="text-[11px] text-[#55556a]">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, campaigns.length)} dari {campaigns.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-[11px] bg-[#1a1a2e] border border-purple-900/20 text-[#9090b0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >← Prev</button>
              {(() => {
                let startPage = Math.max(1, page - 2);
                let endPage = Math.min(totalPages, page + 2);
                if (endPage - startPage < 4) {
                  if (startPage === 1) {
                    endPage = Math.min(totalPages, 5);
                  } else if (endPage === totalPages) {
                    startPage = Math.max(1, totalPages - 4);
                  }
                }
                const pages = [];
                for (let i = startPage; i <= endPage; i++) pages.push(i);
                
                return pages.map(pg => (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-8 h-8 rounded-lg text-[11px] border transition-colors cursor-pointer ${
                      page === pg
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "bg-[#1a1a2e] border-purple-900/20 text-[#9090b0] hover:text-white"
                    }`}
                  >{pg}</button>
                ));
              })()}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-[11px] bg-[#1a1a2e] border border-purple-900/20 text-[#9090b0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archives;
