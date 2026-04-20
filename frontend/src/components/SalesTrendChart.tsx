import React, { useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const dayData = [
  { x: new Date(2024, 0, 1), y: 12 }, { x: new Date(2024, 1, 1), y: 18 },
  { x: new Date(2024, 2, 1), y: 14 }, { x: new Date(2024, 3, 1), y: 25 },
  { x: new Date(2024, 4, 1), y: 32 }, { x: new Date(2024, 5, 1), y: 28 },
  { x: new Date(2024, 6, 1), y: 41 },
];

const monthData = [
  { x: new Date(2024, 0, 1), y: 8  }, { x: new Date(2024, 1, 1), y: 22 },
  { x: new Date(2024, 2, 1), y: 18 }, { x: new Date(2024, 3, 1), y: 35 },
  { x: new Date(2024, 4, 1), y: 28 }, { x: new Date(2024, 5, 1), y: 44 },
  { x: new Date(2024, 6, 1), y: 52 },
];

const SalesTrendChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'day' | 'month'>('month');

  const options = {
    backgroundColor: 'transparent',
    animationEnabled: true,
    animationDuration: 800,
    title: { text: '' },
    axisX: {
      labelFontColor: '#55556a', labelFontSize: 11, labelFontFamily: 'Inter',
      tickColor: 'transparent', lineColor: 'rgba(255,255,255,0.06)',
      gridColor: 'transparent', valueFormatString: 'MMM',
    },
    axisY: {
      labelFontColor: '#55556a', labelFontSize: 11, labelFontFamily: 'Inter',
      gridColor: 'rgba(255,255,255,0.05)', gridDashType: 'dash',
      tickColor: 'transparent', lineColor: 'transparent',
    },
    data: [{
      type: 'spline', color: '#8b5cf6', lineThickness: 2.5,
      markerType: 'circle', markerColor: '#8b5cf6', markerSize: 6,
      markerBorderColor: '#0f0f1a', markerBorderThickness: 2,
      dataPoints: activeTab === 'day' ? dayData : monthData,
    }],
  };

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-white">Sales Trend Over Time</div>
          <div className="text-[11px] text-[#55556a] mt-0.5">Temporal analysis of ad campaign revenue</div>
        </div>
        {/* Tab group */}
        <div className="flex bg-[#14141f] border border-purple-900/20 rounded-lg p-0.5">
          {(['day', 'month'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer
                ${activeTab === t
                  ? 'bg-[#1a1a2e] text-violet-400 shadow-sm'
                  : 'text-[#9090b0] hover:text-white'
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart - containerProps locks the size so CanvasJS can't overflow */}
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
        <CanvasJSChart
          options={options}
          containerProps={{
            style: {
              width: '100%',
              height: '200px',
              position: 'relative',
            },
          }}
        />
      </div>
    </div>
  );
};

export default SalesTrendChart;
