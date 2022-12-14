import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const Select = ({ options, label, onChange, selectedOption }) => {
  // const [selectedOption, setSelectedOption] = useState(selected)
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? options
      : options.filter((person) =>
          person.value
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const handleOnChange = (option) => {
    // setSelectedOption(option);
    onChange(option);
  }

  return (
    <div className="top-16 w-full">
      {label ? <div className="text-sm font-medium text-gray-700 mb-1">{label}</div> : null }
      <Combobox value={selectedOption} by="id" onChange={handleOnChange}>
        <div className="relative">
          <div className="relative w-full cursor-default bg-white text-left shadow-md sm:text-sm rounded-md">
            <Combobox.Input
              className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              displayValue={(person) => person?.value}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Selecccionar ${label?.toLowerCase() || ""}`}
              autoComplete="off"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-[1]">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>`relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.value}
                        </span>
                        {selected ? (
                          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'}`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
};

export default Select;