import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface Props {
  filters: { startDate: string; endDate: string; category?: string; mode: 'day' | 'month' | 'all' };
}

const SalesTrendChart: React.FC<Props> = ({ filters }) => {
  const [activeTab, setActiveTab] = useState<"clicks" | "purchases" | "all">("clicks");
  const [chartData, setChartData] = useState<any>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(0.5);
    let url = `http://localhost:8000/api/charts/sales-trend?start_date=${filters.startDate}&end_date=${filters.endDate}`;
    if (filters.category) url += `&category=${filters.category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
        setOpacity(1);
      })
      .catch((err) => {
        console.error("Gagal mengambil data tren:", err);
        setOpacity(1);
      });
  }, [filters]); // Tidak perlu refetch saat ganti tab karena data sudah mencakup keduanya

  const options = {
    backgroundColor: "transparent",
    theme: "dark2",
    animationEnabled: true,
    animationDuration: 1000,
    legend: {
      cursor: "pointer",
      fontColor: "#9090b0",
      fontSize: 11,
      verticalAlign: "top",
      horizontalAlign: "center",
      dockInsidePlotArea: true,
    },
    axisX: {
      title: "Tren Aktivitas",
      titleFontColor: "#9090b0",
      titleFontSize: 13,
      titleMargin: 2, // Lebih dekat ke label agar tidak terlalu bawah
      labelFontColor: "#55556a",
      labelFontSize: 10,
      interval: filters.startDate === filters.endDate ? 5 : 7, 
      labelAngle: -45,
    },
    axisY: {
      title: activeTab === "all" ? "Klik & Konversi" : activeTab === "clicks" ? "Klik" : "Konversi",
      titleFontColor: "#9090b0",
      labelFontColor: "#55556a",
      gridColor: "rgba(255,255,255,0.05)",
    },
    data: activeTab === "all" ? [
      {
        type: "splineArea",
        name: "Klik",
        showInLegend: true,
        color: "#8b5cf6",
        fillOpacity: 0.1,
        dataPoints: chartData ? chartData.clicks : [],
      },
      {
        type: "splineArea",
        name: "Pembelian",
        showInLegend: true,
        color: "#22d3ee",
        fillOpacity: 0.1,
        dataPoints: chartData ? chartData.purchases : [],
      }
    ] : [
      {
        type: "splineArea",
        name: activeTab === "clicks" ? "Klik" : "Pembelian",
        color: activeTab === "clicks" ? "#8b5cf6" : "#22d3ee",
        fillOpacity: 0.12,
        dataPoints: chartData ? chartData[activeTab] : [],
      },
    ],
  };

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-6 min-h-[480px] flex flex-col">
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <div className="font-['Space_Grotesk'] text-[16px] font-semibold text-white">Analisis Tren Performa</div>
          <div className="text-[11px] text-[#55556a] mt-0.5">Menampilkan tren periode terkait</div>
        </div>
        <div className="flex bg-[#14141f] border border-purple-900/20 rounded-lg p-0.5">
          {(['clicks', 'purchases', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-md text-[11px] font-medium capitalize transition-all duration-300 cursor-pointer
                ${activeTab === t ? 'bg-[#1a1a2e] text-violet-400 shadow-sm' : 'text-[#9090b0] hover:text-white'}`}
            >
              {t === 'clicks' ? 'Klik' : t === 'purchases' ? 'Konversi' : 'Gabungan'}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex-1 transition-opacity duration-500" style={{ height: "380px", opacity: opacity }}>
        {chartData && (chartData.clicks.length > 0 || chartData.purchases.length > 0) ? (
          <CanvasJSChart options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-[#55556a] text-xs">Tidak ada data untuk periode ini</div>
        )}
      </div>
    </div>
  );
};

export default SalesTrendChart;
