import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface Props {
  filters: { startDate: string; endDate: string; category?: string; mode: 'day' | 'month' | 'all' };
}

const CategoryPerformance: React.FC<Props> = ({ filters }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let url = `http://localhost:8000/api/charts/category-performance?start_date=${filters.startDate}&end_date=${filters.endDate}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Gagal mengambil performa kategori:", err));
  }, [filters.startDate, filters.endDate]);

  const filteredData = filters.category 
    ? data.filter(item => item.label === filters.category)
    : data;

  // Hitung nilai maksimum untuk memberikan ruang di atas bar agar label tidak nabrak
  const maxY = filteredData.length > 0 ? Math.max(...filteredData.map(d => d.y)) : 0;
  const axisYMax = maxY > 0 ? maxY * 1.2 : undefined; // Tambahkan 20% ruang di atas


  const options = {
    animationEnabled: true,
    animationDuration: 600,
    theme: "dark2",
    backgroundColor: "transparent",
    axisX: { 
      labelFontColor: "#9090b0", 
      labelFontSize: 11, 
      labelFontFamily: "Space Grotesk",
      tickColor: "transparent",
    },
    axisY: { 
      labelFontColor: "#55556a", 
      gridColor: "rgba(255,255,255,0.05)", 
      prefix: "$",
      margin: 20,
      maximum: axisYMax, // Set maximum dinamis
      includeZero: false,
    },
    data: [
      {
        type: "column",
        color: "#8b5cf6", 
        indexLabel: "${y}",
        indexLabelFontColor: "#fff",
        indexLabelFontSize: 12,
        indexLabelFontWeight: "bold",
        indexLabelPlacement: "outside", 
        indexLabelMargin: 8, // Beri jarak dari atas bar
        dataPoints: filteredData,
      },
    ],
  };

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-6 h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <div className="font-['Space_Grotesk'] text-[16px] font-semibold text-white">
          {filters.category ? `Analisis: ${filters.category}` : "Investasi per Sektor"}
        </div>
        <div className="text-[11px] text-[#55556a] mt-0.5">Filter aktif untuk periode terpilih</div>
      </div>
      
      <div className="relative flex-1" style={{ height: "350px" }}>
        {filteredData.length > 0 ? (
          <CanvasJSChart options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-[#55556a] text-xs">
            Tidak ada data untuk periode ini
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPerformance;
