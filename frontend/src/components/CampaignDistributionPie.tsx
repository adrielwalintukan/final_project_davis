import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const dataPoints = [];

const CampaignDistributionPie: React.FC = () => {
  const options = {
    backgroundColor: "transparent",
    animationEnabled: true,
    animationDuration: 800,
    title: { text: "" },
    legend: {
      fontColor: "#9090b0",
      fontSize: 12,
      horizontalAlign: "center",
      verticalAlign: "bottom",
      cursor: "pointer",
    },
    data: [
      {
        type: "pie",
        startAngle: -90,
        centerX: "50%",
        centerY: "45%",
        radius: "60%",
        showInLegend: true,
        legendText: "{label}",
        indexLabel: "{label} - {y}%",
        indexLabelFontColor: "#ffffff",
        indexLabelFontSize: 11,
        indexLabelFontFamily: "Calibri, ui-sans-serif, system-ui, sans-serif",
        indexLabelPlacement: "outside",
        dataPoints,
      },
    ],
  };

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-5 animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-white">
            Distribusi Kampanye
          </div>
          <div className="text-[11px] text-[#55556a] mt-0.5">
            Diagram lingkaran dari berbagi pengeluaran kampanye
          </div>
        </div>
      </div>

      <div
        style={{ height: "340px", position: "relative", overflow: "visible" }}
      >
        <CanvasJSChart
          options={options}
          containerProps={{
            style: {
              width: "100%",
              height: "340px",
              position: "relative",
            },
          }}
        />
      </div>
    </div>
  );
};

export default CampaignDistributionPie;
