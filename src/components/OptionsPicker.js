
const OptionsPicker = ({ options, label, onChange, optionSelected, size }) => {
  // const [optionSelected, setOptionSelected] = useState(null);

  const handleOptionClick = (option) => {
    // setOptionSelected(option);
    onChange(option);
  }

  return (
    <div className={`w-full ${size === "sm" ? 'text-sm' : 'text-md'}`}>
      {label ? <div className="text-sm font-medium text-gray-700">{label}</div> : null }
      <div className="flex gap-1 mt-1">
        {options?.map((option) => (
          <div
            key={option.id}
            className={`${size === "sm" ? 'px-2 py-1' : 'px-4 py-2'} shadow-sm cursor-pointer rounded-md border ${optionSelected?.id === option?.id ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-300"}  hover:ring-1 hover:ring-indigo-500 hover:border-indigo-500`}
            onClick={() => handleOptionClick(option)}
          >
            {option?.valueToDisplay || option.value}
          </div>
        ))}
      </div>
    </div>
  )
};

export default OptionsPicker;
