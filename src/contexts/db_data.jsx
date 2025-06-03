import { useState, createContext } from "react";

export const DbDataContext = createContext(null);
// export const DbDataContext = createContext({
//   fetchSensorData: () => {}
// });

export default function DbDataContextProvider({ children }) {
  const [selectedSensor, setSelectedSensor] = useState("");
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [sensorData, setSensorData] = useState([]);
  const [aqis, setAqis] = useState(null); // new state for AQI

  const [loading, setLoading] = useState(true);
  const fetchSensorData = () => {
    // console.log('fetching data for:', selectedSensor, dateRange);
    const params = new URLSearchParams({
      host: selectedSensor,
      start: dateRange[0]
        .toLocaleString("sv-SE")
        .replace(" ", "T")
        .replace("T", " "),
      end: dateRange[1]
        .toLocaleString("sv-SE")
        .replace(" ", "T")
        .replace("T", " "),
    });

    fetch(`http://dashboardapi.airifi.io/data.php?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        data = calculateMinutelyAQI(data); // Calculate AQI for each entry        
        setSensorData(data);

        console.log(data.map((d) => (d.aqi)));
      })
      .catch((err) => console.error("Error fetching sensor data:", err))
      .finally(() => setLoading(false));
  };
  function calculateMinutelyAQI(data) {
    return data.map((entry) => {
      const ivoc = parseFloat(entry.IVOC);
      const ico2 = parseFloat(entry.ICO2);
      const ihum = parseFloat(entry.IHUM);
      const itemp = parseFloat(entry.ITemp);

      //normalize values to a scale of 0-10
      // const ivocNorm = (ivoc / 1000) * 10; // Assuming IVOC is in ppb, normalize to 0-10
      const ico2Norm = (ico2 / 2000) * 10; // Assuming ICO2 is in ppm, normalize to 0-10
      const ihumNorm = (ihum / 100) * 10; // Assuming IHUM is in percentage, normalize to 0-10
      const itempNorm = ((itemp - 0) / (50 - 0)) * 10; // Assuming ITemp is in Celsius, normalize to 0-10

      const aqi = ((ico2Norm * 3) + (ihumNorm * 3) + (itempNorm * 1)) / 4;

      // const aqi = ((ivoc * 5 )+ (ico2 * 3) + (ihum * 3) + (itemp * 1)) / 4;

      return {
        ...entry,
        aqi: parseFloat(aqi.toFixed(2)), // Add AQI as a new property, rounded to 2 decimals
      };
    });
  }

  const ctxValue = {
    selectedSensor: selectedSensor,
    setSelectedSensor: setSelectedSensor,
    dateRange: dateRange,
    setDateRange: setDateRange,
    sensorData: sensorData,
    setSensorData: setSensorData,
    loading: loading,
    setLoading: setLoading,
    fetchSensorData: fetchSensorData,
  };
  return (
    <DbDataContext.Provider value={ctxValue}>{children}</DbDataContext.Provider>
  );
}
