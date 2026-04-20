import React, { useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const dayData = [];

const monthData = [];

const SalesTrendChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"day" | "month">("month");

  const options = {
    backgroundColor: "transparent",
    animationEnabled: true,
    animationDuration: 800,
    title: { text: "" },
    axisX: {
      labelFontColor: "#55556a",
      labelFontSize: 11,
      labelFontFamily: "Inter",
      tickColor: "transparent",
      lineColor: "rgba(255,255,255,0.06)",
      gridColor: "transparent",
      valueFormatString: "MMM",
    },
    axisY: {
      labelFontColor: "#55556a",
      labelFontSize: 11,
      labelFontFamily: "Inter",
      gridColor: "rgba(255,255,255,0.05)",
      gridDashType: "dash",
      tickColor: "transparent",
      lineColor: "transparent",
    },
    data: [
      {
        type: "spline",
        color: "#8b5cf6",
        lineThickness: 2.5,
        markerType: "circle",
        markerColor: "#8b5cf6",
        markerSize: 6,
        markerBorderColor: "#0f0f1a",
        markerBorderThickness: 2,
        dataPoints: activeTab === "day" ? dayData : monthData,
      },
    ],
  };

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-white">
            Tren Penjualan Sepanjang Waktu
          </div>
          <div className="text-[11px] text-[#55556a] mt-0.5">
            Analisis temporal pendapatan kampanye iklan
          </div>
        </div>
        {/* Tab group */}
        <div className="flex bg-[#14141f] border border-purple-900/20 rounded-lg p-0.5">
          {(['day', 'month'] as const).map((t) => {
            const labels = { day: 'Hari', month: 'Bulan' };
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer
                  ${
                    activeTab === t
                      ? 'bg-[#1a1a2e] text-violet-400 shadow-sm'
                      : 'text-[#9090b0] hover:text-white'
                  }`}
              >
                {labels[t as 'day' | 'month']}
              </button>
            );
          })}
        </div>

          })}
        </div>
      </div>

      {/* Chart - containerProps locks the size so CanvasJS can't overflow */}
      <div
        style={{ height: "280px", position: "relative", overflow: "hidden" }}
      >
        <CanvasJSChart
          options={options}
          containerProps={{
            style: {
              width: "100%",
              height: "280px",
              position: "relative",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SalesTrendChart;
