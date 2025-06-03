import React from "react";

export function AQIChartsLegend() {
  return (
    <div className="w-full md:w-56 flex-shrink-0 md:mb-10">
      <div className="flex flex-col gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#A8DC5C] inline-block"></span>{" "}
          Low (1–3)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FFD93D] inline-block"></span>{" "}
          Moderate (4–6)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF6B6B] inline-block"></span>{" "}
          High (7–9)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#9B59B6] inline-block"></span>{" "}
          Very High (10)
        </div>
      </div>
    </div>
  );
}
