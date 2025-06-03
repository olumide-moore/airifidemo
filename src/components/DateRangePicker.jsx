import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DbDataContext } from "../contexts/db_data";

export default function DateRangePicker() {
  const { dateRange, setDateRange } = useContext(DbDataContext);
  const [startDate, endDate] = dateRange;
  // console.log(dateRange);

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div>
        <label className="block text-sm font-semibold mb-1 ml-2 text-gray-600">
          From:
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setDateRange([date, endDate]);
            if (date > endDate) {
              setDateRange([date, date]);
            }
          }}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={new Date()}
          dateFormat="yyyy-MM-dd"
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 ml-2 text-gray-600">
          To:
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setDateRange([startDate, date])}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
          dateFormat="yyyy-MM-dd"
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </div>
  );
}
