import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";

const dayValues = {
  narrow: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
  abbreviated: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  wide: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
}
// const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const spanishLocale = {
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

/* for getDocs response only */
export const getArrayFromCollection  = (collection) => {
  return collection.docs.map((doc) => {
    return {...doc.data(), id: doc.id}
  })
}

export const makeClassTimeHoursReadable = (hour) => {
  const classTimeHours = {
    1: "Primera",
    2: "Segunda",
    3: "Tercera",
    4: "Cuarta",
    5: "Quinta",
    6: "Sexta",
    7: "Septima"
  };
  return `${classTimeHours[hour]} hora`
};