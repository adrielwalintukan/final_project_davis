import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import SalesTrendChart from "./components/SalesTrendChart";
import CategoryPerformance from "./components/CategoryPerformance";
import CampaignDistributionPie from "./components/CampaignDistributionPie";
import RecentCampaigns from "./components/RecentCampaigns";
import AIAnalyst from "./components/AIAnalyst";

const metrics = [];

function App() {
  const [activeNav, setActiveNav] = useState("command");

  return (
    <div className="flex h-screen w-full bg-[#0f0f1a] text-white overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex-1 flex flex-col overflow-hidden bg-[#0f0f1a]">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Center content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-5 flex flex-col gap-4">
            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-3.5">
              {metrics.map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>

            {/* Charts Row */}
            <div
              className="grid gap-3.5 items-stretch"
              style={{ gridTemplateColumns: "1fr 0.9fr" }}
            >
              <CampaignDistributionPie />
              <CategoryPerformance />
            </div>

            {/* Line chart below */}
            <SalesTrendChart />

            {/* Table */}
            <RecentCampaigns />
          </div>

          {/* AI Panel */}
          <AIAnalyst />
        </div>
      </div>
    </div>
  );
}

export default App;
