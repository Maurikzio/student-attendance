import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateStudent } from "../store/students/studentsSlice";
import { selectUserInfo } from "../store/user/userSlice";

const StudentName = ({ info }) => {
  const [isHovered, setIsHoreved] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const studentInfo = info.row.original;

  const colors = {
    yellow: "bg-yellow-400",
    green: "bg-green-500",
    red: "bg-red-600"
  };

  const alerts = Object.entries(studentInfo.alerts).map(([k, v]) => {
    return (
      colors?.[k] ? <span key={k} className={`${colors[k]} w-4 h-4 rounded-full text-center flex items-center justify-center text-sm`}>{v}</span> : null
    )
  });

  const handleLockUnlockStudent = () => {
    const isLocked = !studentInfo?.locked;
    const grade = studentInfo.grade.replace(/[A-Z]/g, "");
    dispatch(updateStudent({ data : { locked: isLocked } , gradeNumber: grade, studentId: studentInfo.studentId }))
  }

  return (
    <div className={`flex items-center ${studentInfo?.locked ? 'opacity-50' : 'opacity-100'}`} onMouseOver={() => setIsHoreved(true)} onMouseOut={() => setIsHoreved(false)}>
      {userInfo?.role === 'inspector' ? (
        <button className={`mr-2 ${isHovered ? 'visible' : 'invisible'}`} onClick={handleLockUnlockStudent}>
          {studentInfo?.locked ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className='w-4 h-4'>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )}
        </button>
      ) : null }

      <Link
        className="hover:text-indigo-600"
        to={`/estudiante/${studentInfo.grade}/${studentInfo.studentId}`}
      >
        {info.getValue()}
      </Link>
      <div className="ml-4 flex gap-1">{alerts}</div>
    </div>
  )
};

export default StudentName;