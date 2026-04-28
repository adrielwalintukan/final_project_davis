import { useState, useEffect } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import SalesTrendChart from "./components/SalesTrendChart";
import CategoryPerformance from "./components/CategoryPerformance";
import CampaignDistributionPie from "./components/CampaignDistributionPie";
import RecentCampaigns from "./components/RecentCampaigns";
import AIAnalyst from "./components/AIAnalyst";
import CampaignInsights from "./components/CampaignInsights";
import Archives from "./components/Archives";

function App() {
  const [activeNav, setActiveNav] = useState("command");
  const [metrics, setMetrics] = useState<any>(null);
  
  // State Filter Global dengan default 2025-07-15
  const [filters, setFilters] = useState<{ startDate: string; endDate: string; category?: string; mode: 'day' | 'month' | 'all' }>({
    startDate: "2025-07-15",
    endDate: "2025-07-15",
    category: "",
    mode: 'day'
  });

  useEffect(() => {
    // Ambil data KPI dengan menyertakan filter rentang tanggal
    let url = `http://localhost:8000/api/metrics?start_date=${filters.startDate}&end_date=${filters.endDate}`;
    if (filters.category) url += `&category=${filters.category}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Gagal mengambil metrik:", err));
  }, [filters]);

  const metricCards = metrics ? [
    {
      label: filters.mode === 'day' ? "INVESTASI HARIAN" : "INVESTASI BULANAN",
      value: `$${metrics.summary.total_budget.toLocaleString()}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      subtitle: `${metrics.summary.total_campaigns} Kampanye`
    },
    {
      label: "CLICK-THROUGH RATE",
      value: `${metrics.performance.ctr_percent}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
        </svg>
      ),
      subtitle: `${metrics.performance.clicks.toLocaleString()} Klik Total`
    },
    {
      label: "CONVERSION RATE",
      value: `${metrics.performance.cvr_percent}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      subtitle: `${metrics.performance.purchases.toLocaleString()} Konversi`
    },
    {
      label: filters.mode === 'day' ? "JANGKAUAN HARIAN" : "JANGKAUAN BULANAN",
      value: metrics.summary.unique_users_reached.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      subtitle: "Audiens Unik"
    }
  ] : [];

  return (
    <div className="flex h-screen w-full bg-[#0f0f1a] text-white overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0f0f1a]">
        {/* Header hanya tampil di Command Deck */}
        {activeNav === "command" && (
          <Header onFilterChange={(newFilters) => setFilters(newFilters)} />
        )}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          {activeNav === "command" && (
            <div className="flex-1 overflow-y-auto scrollbar-hide p-5 flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-3.5">
                {metricCards.map((m) => (
                  <MetricCard key={m.label} {...m} />
                ))}
              </div>
              <div className="grid gap-3.5 items-stretch" style={{ gridTemplateColumns: "1fr 0.9fr" }}>
                <CampaignDistributionPie filters={filters} />
                <CategoryPerformance filters={filters} />
              </div>
              <SalesTrendChart filters={filters} />
              <RecentCampaigns filters={filters} />
            </div>
          )}
          {activeNav === "insights" && <CampaignInsights />}
          {activeNav === "archives" && <Archives />}
          <AIAnalyst filters={filters} metrics={metrics} />
        </div>
      </div>
    </div>
  );
}

export default App;
