import { Switch } from '@headlessui/react'

const Toggle = ({ isChecked, label, onChange, textForChecked, textForUnchecked }) => {
  // const [isEnabled, setIsEnabled] = useState(isChecked);

  const handleOnChange = (value) => {
    // setIsEnabled(value);
    onChange(value);
  }

  return (
    <div>
      {label ? <div className="text-sm font-medium text-gray-700">{label}</div> : null }
      <div className='flex gap-6 items-center mt-1'>
        <Switch
          checked={isChecked}
          onChange={handleOnChange}
          className={`${isChecked ? 'bg-red-700' : 'bg-yellow-500'}
          relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
          <span
            aria-hidden="true"
            className={`${isChecked ? 'translate-x-6' : 'translate-x-1'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
        </Switch>
        <div className='text-sm text-gray-500'>{isChecked ? textForChecked : textForUnchecked}</div>
      </div>
    </div>
  )
}

export default Toggle;