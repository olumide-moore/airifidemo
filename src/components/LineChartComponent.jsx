import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import { FaTemperatureHigh } from "react-icons/fa"; // Import the icon
import { MdAir, MdCo2, MdNoiseAware } from "react-icons/md";
import { HiCloud } from "react-icons/hi";
import { RiWaterPercentFill, RiWaterPercentLine } from "react-icons/ri";
import { SiWeightsandbiases } from "react-icons/si";
import { WiCloudyGusts } from "react-icons/wi";
import { useContext } from "react";
import { DbDataContext } from "../contexts/db_data";

// const data = [
//   { time: "12:00", value: 21 },
//   { time: "12:05", value: 30 },
//   { time: "12:10", value: 20 },
//   { time: "12:15", value: 22 },
//   { time: "12:20", value: 26 },
//   { time: "12:25", value: 25 },
//   { time: "12:30", value: 23 },
// ];

export default function LineChartComponent({ title, data }) {
  // console.log(data);
  const {loading} = useContext(DbDataContext);
  const icons = {
    Temperature: <FaTemperatureHigh />,
    CO2: <WiCloudyGusts  size={20}/>,
    NO2: <HiCloud />,
    Noise: <MdNoiseAware />,
    Humidity: < RiWaterPercentLine/>,
    PM: <SiWeightsandbiases/>,
  };
  const units = {
    Temperature: "°C",
    Humidity: "%",
    PM: "µg/m³",
    CO2: "ppm",
    NOX: "ticks",
    VOC: "ticks",
    Noise: "dB",
  };
// const graphColor="#5B5F66";
const graphColor="#2c3454";
// const graphColor="#2B344D";


  return (
    <div className="bg-white rounded-md shadow-md p-6 w-full ">
      <div className="mb-4">
        <h2 className="text-md text-gray-800 flex items-center gap-2">
          {icons[title]}
          {title}
        </h2>
        { !loading &&data.length > 0 ? (
          <>
            {/* <p className="text-sm text-gray-600">{Math.min(...data.map(d => d.value))} - {Math.max(...data.map(d => d.value))}</p> */}
            <p className="text-xs text-gray-600">
              {new Date(
                Math.min(...data.map((d) => new Date(d.time)))
              ).toLocaleDateString()}{" "}
              -{" "}
              {new Date(
                Math.max(...data.map((d) => new Date(d.time)))
              ).toLocaleDateString()}
            </p>
            <p className="text-[10px] text-gray-400">
              {data.length} data points
            </p>
          </>
        ) : (
          <p className="text-xs text-gray-600">No data available</p>
        )}
      </div>
      <div className="h-64">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        )}
        {!loading && 
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#777" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(timeStr) => {
                const date = new Date(timeStr);
                return `${date.getDate().toString().padStart(2, "0")}-${(
                  date.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")} ${date
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
              }}
              interval={Math.ceil(data.length / 6)} // Show roughly 6 ticks
            />
            <YAxis
        
              tick={{ fontSize: 11, fill: "#777" }}
              tickFormatter={(value) => `${value}${units[title]}`}
              axisLine={false}
              tickLine={false}
              domain={[0, 40]}
            />
            <Tooltip
              contentStyle={{ fontSize: "12px", borderRadius: "4px" }}
              labelStyle={{ color: "#555" }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return `${date.getDate().toString().padStart(2, "0")}-${(
                  date.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")} ${date
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
              }}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={graphColor}
              strokeWidth={2}
              dot={{ r: 0, fill: {graphColor} }}
              activeDot={{ r: 4, fill: {graphColor} }}
            />
            <Brush dataKey="time" height={30} stroke="#bbb"
              tickFormatter={(timeStr) => {
                const date = new Date(timeStr);
                return `${date.getDate().toString().padStart(2, "0")}-${(
                  date.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")} ${date
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
              }}
             />
          </LineChart>
        </ResponsiveContainer>
        }
      </div>
    </div>
  );
}
