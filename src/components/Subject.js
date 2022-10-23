const Subject = ({ subject, onClickSubject, selectedSubject }) => {
  const sixPercentage = (subject.totalHours * 6) / 100;
  const eigthPercentage = (subject.totalHours * 8) / 100;
  const tenPercentage = (subject.totalHours * 10) / 100;

  let bgClassnames = "bg-white";

  if(subject.absences >= sixPercentage && subject.absences < eigthPercentage) {
    bgClassnames = "bg-green-500";
  }else if(subject.absences >= eigthPercentage && subject.absences < tenPercentage) {
    bgClassnames = "bg-yellow-400";
  }else if(subject.absences >= tenPercentage) {
    bgClassnames = "bg-red-600";
  }

  return (
    <div className={`flex cursor-pointer w-[350px] ${selectedSubject === subject.id ? 'bg-indigo-100' : ''}`} onClick={() => onClickSubject(subject.id)}>
      <p className="w-[250px]">{subject.subjectName}</p>
      <p className="flex items-center gap-2"><span className={`w-4 h-4 rounded-full ${bgClassnames}`}/> {subject.absences}</p>
    </div>
  )
}

export default Subject;