const Subject = ({ subject }) => {
  const sixPercentage = (subject.totalHours * 6) / 100;
  const eigthPercentage = (subject.totalHours * 8) / 100;
  const tenPercentage = (subject.totalHours * 10) / 100;

  let bgClassnames = "bg-white";

  if(subject.absences >= sixPercentage && subject.absences < eigthPercentage) {
    bgClassnames = "bg-green-700";
  }else if(subject.absences >= eigthPercentage && subject.absences < tenPercentage) {
    bgClassnames = "bg-yellow-700";
  }else if(subject.absences >= tenPercentage) {
    bgClassnames = "bg-red-700";
  }

  return (
    <div className="flex">
      <p className="w-[300px]">{subject.subjectName}</p>
      <p className="flex items-center gap-2"><span className={`w-4 h-4 rounded-full ${bgClassnames}`}/> {subject.absences}</p>
    </div>
  )
}

export default Subject;