import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface Props {
  filters: { startDate: string; endDate: string; category?: string; mode: 'day' | 'month' | 'all' };
}

const CampaignDistributionPie: React.FC<Props> = ({ filters }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let url = `http://localhost:8000/api/charts/platform-distribution?start_date=${filters.startDate}&end_date=${filters.endDate}`;
    if (filters.category) url += `&category=${filters.category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Gagal mengambil distribusi platform:", err));
  }, [filters]);

  const options = {
    animationEnabled: true,
    backgroundColor: "transparent",
    theme: "dark2",
    legend: { fontColor: "#9090b0", fontSize: 9, verticalAlign: "center", horizontalAlign: "right" },
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{y}",
        indexLabelFontColor: "#9090b0",
        indexLabelFontSize: 9,
        innerRadius: "65%",
        radius: "70%",
        dataPoints: data.map((item, index) => ({
          ...item,
          color: index === 0 ? "#8b5cf6" : "#22d3ee",
        })),
      },
    ],
  };

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-5 flex flex-col h-full">
      <div className="mb-1">
        <div className="font-['Space_Grotesk'] text-[14px] font-semibold text-white">Platform Market Share</div>
        <div className="text-[10px] text-[#55556a] mt-0.5">Filter aktif berdasarkan periode</div>
      </div>
      <div className="relative flex-1 min-h-[150px]">
        {data.length > 0 ? <CanvasJSChart options={options} /> : <div className="h-full flex items-center justify-center text-[#55556a] text-[9px]">Tidak ada data untuk periode ini</div>}
      </div>
    </div>
  );
};

export default CampaignDistributionPie;
