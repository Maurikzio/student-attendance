/** @see: https://github.com/date-fns/date-fns/blob/main/docs/i18nContributionGuide.md */
import { useState } from "react";
import ReactDatePicker /*{ registerLocale, setDefaultLocale }*/ from "react-datepicker";
// import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";
import getDay from "date-fns/getDay"
// registerLocale('es', es)
// setDefaultLocale('es');

// registerLocale('ES', {
//   localize: {
//     month: n => months[n],
//     day: n => days[n]
//   },
//   formatLong:{}
// });

const dayValues = {
  narrow: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
  abbreviated: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  wide: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
}
// const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const locale = {
  localize: {
    // day: n => days[n],
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "narrow",
      formattingValues: dayValues,
      defaultFormattingWidth: 'narrow'
    }),
    month: n => months[n]
  },
  formatLong: {
    date: () => 'mmmm-dd-yyyy'
  }
}

const DatePicker = ({ label, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(Date.now());

  const onDatePickerChange = (date) => {
    setSelectedDate(date)
    // console.log(date.valueOf());
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
        locale={locale}
        dateFormat="iiii, LLLL dd yyyy"
        onChange={onDatePickerChange}
        filterDate={isWeekend}
      />
    </div>
  );
};

export default DatePicker;

// with: Date.now() , + new Date() and new Date().valueOf() we get the milliseconds (timestamp)
