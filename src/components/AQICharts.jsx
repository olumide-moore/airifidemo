import  { useState, useEffect, useContext } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { DbDataContext } from "../contexts/db_data";

// Format HH:mm
const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const generateNewDataPoint = () => {
  const now = new Date();
  return {
    time: formatTime(now),
    AQI: Math.floor(Math.random() * 10) + 1,
  };
};
const getBarColor = (value) => {
  if (value >= 1 && value <= 3) return "#A8DC5C"; // Green
  if (value >= 4 && value <= 6) return "#FFD93D"; // Yellow
  if (value >= 7 && value <= 9) return "#FF6B6B"; // Red
  if (value === 10) return "#9B59B6";             // Purple
  return "#ccc"; // Default/fallback
};

export default function  AqiBarChart(){
  const { loading }  = useContext(DbDataContext); 
  const [data, setData] = useState(() => {
    const now = new Date();
    return Array.from({ length: 20 }, (_, i) => {
      const d = new Date(now.getTime() - (19 - i) * 60 * 1000); // 1-minute intervals
      return {
        time: formatTime(d),
        AQI: Math.floor(Math.random() * 10) + 1,
      };
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const nextPoint = generateNewDataPoint();
        return [...prevData.slice(1), nextPoint];
      });
    }, 30000); // update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-80 p-1">
      {/* Title */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-gray-400"></div>
        </div>
      )}
      {!loading && (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="">
              <h2 className="text-lg text-gray-600">Airifi AQI</h2>
              <p className="text-xs text-gray-400">1–5 June, 2025</p>
            </div>
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: "transparent" }} 
              contentStyle={{ fontSize: "12px", borderRadius: "4px" }}
              labelStyle={{ color: "#555" }}
                />
                <Bar
                  dataKey="AQI"
                  radius={[5, 5, 0, 0]}
                  activeBar={false}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.AQI)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

