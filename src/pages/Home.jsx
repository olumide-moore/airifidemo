import AQIChart from "../components/AQICharts";
import LineChartComponent from "../components/LineChartComponent";
import Header from "../components/Header";
import { SensorsDropdown } from "../components/SensorsDropdown";
import { AQIChartsLegend } from "../components/AQIChartsLegend";
import { useContext, useEffect, useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import SensorOverride from "../components/SensorOverride";
import { DbDataContext } from "../contexts/db_data";

export default function Home() {
  const { selectedSensor, dateRange, sensorData, fetchSensorData, setLoading } =
    useContext(DbDataContext);

  // Fetch data when sensor or date changes
  useEffect(() => {
    if (!selectedSensor || !dateRange[0] || !dateRange[1]) return;

    setLoading(true);
    dateRange[0].setHours(0, 0, 0, 0);
    dateRange[1].setHours(23, 59, 59, 999);

    fetchSensorData();

    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const todayIsInRange = dateRange[0] <= today && today <= dateRange[1];

    let interval = null;

    if (todayIsInRange) {
      interval = setInterval(() => {
        fetchSensorData();
      }, 30000); // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedSensor, dateRange]);

  // useEffect(() => {

  // fetch("http://localhost:8080/data.php")
  //   .then((response) => response.json())
  //   .then((json) => {
  //     setSensorData(json);
  //     console.log(Object.keys(json[0]));
  //     setLoading(false);
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching data:", error);
  //     setLoading(false);
  //   });
  // }, []);
  // if (loading) return <p>Loading...</p>;
  const ico2Series = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.ICO2),
  }));

  const iTempSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.ITemp),
  }));
  const iHumSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.IHUM),
  }));
  const iVocSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.IVOC),
  }));
  const eTempSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.ETemp),
  }));
  const ePmSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.EPM),
  }));
  const eVocSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.EVOC),
  }));
  const eNoxSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.ENOX),
  }));
  const edbslSeries = sensorData.map((d) => ({
    time: d.created,
    value: parseFloat(d.EdBSL),
  }));
  return (
    <div className="min-h-screen bg-zinc-100 pt-1 pb-10 font-poppins">
      <Header />
      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {sensorData.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )} */}
      <div className=" px-4 md:px-8 lg:px-8">
        <section className="my-6 bg-white p-5 shadow-sm grid sm:grid-cols-2 gap-4">
          <div className="text-sm text-gray-600">
            <SensorsDropdown />
            {/* <p>
              <span className="font-medium">
                Location:&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              Room
            </p> */}
          </div>
          <DateRangePicker />
        </section>

        <section className="mb-6">
          <SensorOverride />
        </section>

        <section className="mb-12 bg-white shadow-md rounded-md">
          {/* Header and Date */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-16 p-6">
            <AQIChart />
            <AQIChartsLegend />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Internal Sensors */}
            <div className="space-y-4">
              <h2 className=" pl-2  py-1 bg-white shadow-sm w-52 text-lg text-gray-700">
                Internal Sensors
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <LineChartComponent title="Temperature" data={iTempSeries} />
                <LineChartComponent title="CO2" data={ico2Series} />
                <LineChartComponent title="Humidity" data={iHumSeries} />
                <LineChartComponent title="VOC" data={iVocSeries} />
              </div>
            </div>

            {/* External Sensors */}
            <div className="space-y-4">
              <h2 className=" pl-2  py-1 bg-white shadow-sm w-52 text-lg text-gray-800">
                External Sensors
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <LineChartComponent title="Temperature" data={eTempSeries} />
                <LineChartComponent title="PM" data={ePmSeries} />
                <LineChartComponent title="NOX" data={eNoxSeries} />
                <LineChartComponent title="VOC" data={eVocSeries} />
                <LineChartComponent title="Noise" data={edbslSeries} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
