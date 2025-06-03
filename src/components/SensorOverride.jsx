import React, { useEffect, useState } from "react";

const SensorOverride = () => {
  const [override, setOverride] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [sensorValues, setSensorValues] = useState({
    ICO2: 800,
    ITemp: 20,
    IHUM: 50,
    // IVOC: 100,
    // ETemp: 20,
    // EPM: 25,
    // EVOC: 100,
    // ENOX: 50,
    // EdBSL: 30,
  });
  const sensorValuesRange = {
    ICO2: [0, 2000],
    ITemp: [0, 50],
    IHUM: [0, 100],
    // IVOC: [0, 1000],
    // ETemp: [0, 50],
    // EPM: [0, 100],
    // EVOC: [0, 1000],
    // ENOX: [0, 100],
  };

  const handleToggleChange = () => {
    const newState = !override ? "on" : "off";
    const params = new URLSearchParams({ state: newState, ...sensorValues });

    fetch(`http://airifi623334.local/overidereadings?${params.toString()}`)
      .then((response) => {
        if (response.ok) {
    setOverride(!override);
      }
      return response.text();
    })
    .then((data) => console.log("ESP32 says:", data))
    .catch((error) => console.error("Error toggling override:", error));
  };
  const handleSliderChange = (sensor, value) => {
    setSensorValues((prev) => ({ ...prev, [sensor]: value }));
  };

  const internalSensors = {
    ICO2: "Internal CO2",
    ITemp: "Internal Temperature",
    IHUM: "Internal Humidity",
  }; //, "IVOC": "Internal VOC"

  // const externalSensors = ["ETemp", "EPM", "EVOC", "ENOX"]; //, "EdBSL"];

  function sendReadings() {
    // Send value to ESP32 via GET request
    const params = new URLSearchParams(sensorValues);

    fetch(`http://airifi623334.local/overidereadings?${params.toString()}`)
      .then((response) => {
        if (response.ok) {
          setChangesSaved(true);
        }
        return response.text();
      })
      .then((data) => console.log("ESP32 says:", data))
      .catch((error) => console.error("Error sending data to ESP32:", error));
  }

  useEffect(() => {
    if (changesSaved) {
      const timer = setTimeout(() => {
        setChangesSaved(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [changesSaved]);
  return (
    <div className="py-3 px-5 max-w-xl bg-white shadow-sm rounded-lg">
      {/* Sliders Section - Collapsible */}

      {/* Override Toggle */}
      <div className="flex items-center space-x-6 ">
        <h2 className="text-sm text-gray-600 font-semibold">Sensor Override</h2>
        <div className="flex items-center gap-3">
          {/* <span className="text-md">Override</span> */}
          <div
            className={`relative w-12 h-5 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
              override ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={handleToggleChange}
          >
            {/* Toggle Circle */}
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 border-2 ${
                override
                  ? "translate-x-7 border-blue-600"
                  : "translate-x-0 border-gray-400"
              }`}
            />

            {override ? (
              <span
                className={`absolute left-1 text-[10px] font-bold transition-colors ${
                  override ? "text-white/100" : "text-white"
                }`}
              >
                {/* OFF Label */}
                OFF
              </span>
            ) : (
              <span
                className={`absolute right-1.5 text-[10px] font-bold transition-colors ${
                  override ? "text-white" : "text-white/100"
                }`}
              >
                {/* ON Label */}
                ON
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sliders Section */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          override ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Internal Sensors */}
          <div>
            {/* <h3 className="text-lg font-semibold mb-4">Internal Sensors</h3> */}
            {Object.entries(internalSensors).map(([sensor, label]) => (
              <div key={sensor} className="mb-6">
                <label className="block text-xs mb-1 text-gray-600">
                  {sensor}:&nbsp; {sensorValues[sensor]}
                </label>
                <input
                  type="range"
                  min={sensorValuesRange[sensor][0]}
                  max={sensorValuesRange[sensor][1]}
                  value={sensorValues[sensor]}
                  disabled={!override}
                  onChange={(e) =>
                    handleSliderChange(sensor, parseInt(e.target.value))
                  }
                  className={`w-full bg-gray-200 rounded-lg h-2 appearance-none cursor-pointer focus:outline-none focus:ring-2  ring-gray-300`}
                  //set color if override is true
                  // className={`w-full bg-gray-200 rounded-lg h-2 cursor-pointer text-white ${
                  //   override ? "ring-red-500" : "ring-gray-300"
                  // }`}
                />
              </div>
            ))}
          </div>

          {/* <div>
          <h3 className="text-lg font-semibold mb-4">External Sensors</h3>
          {externalSensors.map((sensor) => (
            <div key={sensor} className="mb-6">
              <label className="block text-sm font-medium mb-1">
                {sensor}: {sensorValues[sensor]}
              </label>
              <input
                type="range"
                min={sensorValuesRange[sensor][0]}
                max={sensorValuesRange[sensor][1]}
                value={sensorValues[sensor]}
                disabled={!override}
                onChange={(e) =>
                  handleSliderChange(sensor, parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
          ))}
        </div> */}
        </div>

        {/*Button to Save Changes*/}
        <div className="">
          <button
            onClick={sendReadings}
            disabled={!override}
            className={`px-4 py-2 text-white text-xs rounded-lg ${
              override
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
        {changesSaved && (
          <span className="text-xs text-[#2B344D] ml-2">Changes saved</span>
        )}
      </div>
    </div>
  );
};

export default SensorOverride;
