import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import OptionsPicker from "../components/OptionsPicker";
import Spinner from "../components/Spinner";
import { gradeLetters, grades } from '../helpers';
import { createStudent } from "../store/students/studentsSlice";


const NewStudent = () => {
const { loading: loadingStudents } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      secondName: "",
      secondLastname: "",
      gradeNumber: "",
      gradeLetter: "",
    },
    onSubmit: (values) => {
      const { name, lastname, secondName, secondLastname, gradeLetter, gradeNumber } = values;
      const data = {
        name,
        secondName,
        lastname,
        secondLastname,
        grade: `${gradeNumber.id}${gradeLetter.id}`,
        absences: {"J":0,"list":[],"I":0}
      };
      dispatch(createStudent({ data, gradeNumber: gradeNumber.id }));
      formik.resetForm();
    }
  });

  const gradeLettersForGradeSelected = !formik.values.gradeNumber
    ? gradeLetters
    : gradeLetters.filter((gradeLetter) => gradeLetter.grades.includes(formik.values.gradeNumber?.id));

  return (
    <>
      <Spinner isLoading={loadingStudents}/>
      <div className='w-full h-full text-black p-4 flex items-center justify-center content-center'>
        <div className='bg-white rounded-md p-10 grid grid-cols-2 gap-5'>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 col-span-2 text-center">Registrar Estudiante</h1>
          <div className='min-w-[300px]'>
            <label htmlFor="name" className='block text-gray-700 text-sm font-medium mb-2'>Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre del estudiante"
              onChange={formik.handleChange}
              value={formik.values.name}
              autoComplete="off"
              // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
          </div>
          <div className='min-w-[300px]'>
            <label htmlFor="lastname" className='block text-gray-700 text-sm font-medium mb-2'>Segundo nombre</label>
            <input
              type="text"
              name="secondName"
              placeholder="Segundo nombre del estudiante"
              onChange={formik.handleChange}
              value={formik.values.secondName}
              autoComplete="off"
              // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
          </div>
          <div className='min-w-[300px]'>
            <label htmlFor="lastname" className='block text-gray-700 text-sm font-medium mb-2'>Apellido</label>
            <input
              type="text"
              name="lastname"
              placeholder="Apellido del estudiante"
              onChange={formik.handleChange}
              value={formik.values.lastname}
              autoComplete="off"
              // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
          </div>
          <div className='min-w-[300px]'>
            <label htmlFor="secondLastname" className='block text-gray-700 text-sm font-medium mb-2'>Segundo apellido</label>
            <input
              type="text"
              name="secondLastname"
              placeholder="Segundo apellido del estudiante"
              onChange={formik.handleChange}
              value={formik.values.secondLastname}
              autoComplete="off"
              // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
          </div>
          <hr className="col-span-2"/>
          <div>
            <OptionsPicker
              options={grades}
              label="Curso"
              optionSelected={formik.values.gradeNumber}
              onChange={(newGrade) => {
                if(newGrade.id === 10) {
                  formik.setFieldValue("gradeLetter", "")
                }
                formik.setFieldValue("gradeNumber", newGrade)
              }}
            />
          </div>
          <div>
            <OptionsPicker
              options={gradeLettersForGradeSelected}
              label="Paralelo"
              optionSelected={formik.values.gradeLetter}
              onChange={(value) => formik.setFieldValue("gradeLetter", value)}
            />
          </div>
          <hr className="col-span-2"/>
          <button
            type="button"
            disabled={!formik.values.name
              || !formik.values.secondName
              || !formik.values.lastname
              || !formik.values.secondLastname
              || !formik.values.gradeNumber
              || !formik.values.gradeLetter
            }
            className="col-span-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm enabled:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
            onClick={formik.handleSubmit}
          >Registrar estudiante</button>
        </div>
      </div>
    </>
  )
};

export default NewStudent;
