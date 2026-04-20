import { useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import SalesTrendChart from './components/SalesTrendChart';
import CategoryPerformance from './components/CategoryPerformance';
import RecentCampaigns from './components/RecentCampaigns';
import AIAnalyst from './components/AIAnalyst';

const metrics = [
  {
    label: 'Total Ad Spend',
    value: '$1,284,592',
    change: '+12.5%', changeType: 'up' as const, changeLabel: 'vs last month',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    bars: [4, 6, 5, 7, 6, 8, 10, 9, 11, 12],
  },
  {
    label: 'Transactions',
    value: '48,291',
    change: '-3.2%', changeType: 'down' as const, changeLabel: 'frequency dip',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    bars: [9, 11, 10, 8, 7, 9, 8, 7, 8, 7],
  },
  {
    label: 'New Entities',
    value: '8,402',
    change: '+24.1%', changeType: 'up' as const, changeLabel: 'viral expansion',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    bars: [5, 6, 7, 8, 9, 11, 10, 12, 14, 15],
  },
  {
    label: 'Avg Order Val',
    value: '$142.08',
    change: '+5.7%', changeType: 'up' as const, changeLabel: 'basket optimization',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    bars: [7, 8, 7, 9, 8, 9, 10, 9, 10, 11],
  },
];

function App() {
  const [activeNav, setActiveNav] = useState('command');

  return (
    <div className="flex h-screen w-full bg-[#0f0f1a] text-white overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex-1 flex flex-col overflow-hidden bg-[#0f0f1a]">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Center content */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-3.5">
              {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
            </div>

            {/* Charts Row */}
            <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 260px' }}>
              <SalesTrendChart />
              <CategoryPerformance />
            </div>

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
