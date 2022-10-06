/** @see: https://github.com/date-fns/date-fns/blob/main/docs/i18nContributionGuide.md */
import { useState } from "react";
import ReactDatePicker /*{ registerLocale, setDefaultLocale }*/ from "react-datepicker";
// import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import getDay from "date-fns/getDay"
import { spanishLocale } from "../../helpers";


const DatePicker = ({ date, label, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(date ?? Date.now());

  const onDatePickerChange = (date) => {
    setSelectedDate(date)
    onChange(date.valueOf());
  };

  const isWeekend = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  }

  return (
    <div className="w-full max-w-[250px]">
      {label ? <div className="text-sm font-medium text-gray-700">{label}</div> : null }
      <ReactDatePicker
        selected={selectedDate}
        className="mt-1 w-full block rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        popperPlacement="bottom"
        dayClassName={() => "rdp__day"}
        calendarClassName=""
        locale={spanishLocale}
        dateFormat="iiii, dd LLLL yyyy"
        onChange={onDatePickerChange}
        filterDate={isWeekend}
      />
    </div>
  );
};

export default DatePicker;

// with: Date.now() , + new Date() and new Date().valueOf() we get the milliseconds (timestamp)
