"use client";
import React, { useRef } from "react";
import html2canvas from "html2canvas"; // 需安装：npm install html2canvas

// Define the structure of chart data
interface ChartData {
  label: string;
  value: number;
  color: string;
}

// Mock chart data (to be replaced with real API data in production)
const mockChartData: ChartData[] = [
  { label: "Q1", value: 120, color: "#3b82f6" },
  { label: "Q2", value: 190, color: "#10b981" },
  { label: "Q3", value: 250, color: "#f59e0b" },
  { label: "Q4", value: 300, color: "#ef4444" },
];

export default function DataChart() {
  const chartRef = useRef<HTMLDivElement>(null); // Ref for chart container

  // Handle chart download as PNG
  const handleDownloadChart = async () => {
    if (!chartRef.current) return;

    // Use html2canvas to capture chart DOM
    const canvas = await html2canvas(chartRef.current, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false
    });

    // Create download link
    const link = document.createElement("a");
    link.download = `sales-chart-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Sales Trend (2025)</h3>
        {/* Download Button */}
        <button
          onClick={handleDownloadChart}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          📥 Download Chart
        </button>
      </div>
      
      {/* Bar chart container (attach ref) */}
      <div ref={chartRef} className="flex items-end gap-2 h-64">
        {mockChartData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            style={{ width: "20%" }}
          >
            {/* Bar element */}
            <div
              className="bg-gray-200 rounded-t"
              style={{
                height: `${(item.value / 300) * 100}%`,
                width: "80%",
                backgroundColor: item.color,
              }}
            ></div>
            {/* Label and value */}
            <span className="mt-2 text-sm">{item.label}</span>
            <span className="mt-1 text-sm font-medium">${item.value}K</span>
          </div>
        ))}
      </div>
    </div>
  );
}