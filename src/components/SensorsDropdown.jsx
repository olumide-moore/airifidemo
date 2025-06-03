import { useContext, useEffect, useState } from "react";
import { DbDataContext } from "../contexts/db_data";

export function SensorsDropdown() {
  const [options, setOptions] = useState([]);
  const {setSelectedSensor} = useContext(DbDataContext);

  // console.log("Selected Sensor:", selectedSensor);
  // console.log("Sensor Options:", options);
  useEffect(() => {
    // fetch("http://dashboardapi.airifi.io/sensors.php")
    //   .then((res) => res.json())
    //   .then((json) => {
    //     // console.log(json);
    //     setOptions(json);
    //     setSelectedSensor((prev) => prev || json[0]); // set only if none
    //     console.log(json);
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching sensor list:", err);s
    //     setLoading(false);
    //   });
    setOptions(['2C:BC:BB:62:33:34']); // Hardcoded for testing
    setSelectedSensor((prev) => prev || '2C:BC:BB:62:33:34'); // set only if none
  }, []);

  return (
    <div className="">
      <label className="block text-sm font-semibold mb-1 ml-2 text-gray-600">Sensor ID:</label>
      <select
        // value={selectedSensor}
        onChange={(e) => setSelectedSensor(e.target.value)}
        className="border rounded px-3 py-2"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
