import React from 'react'

const SelectInput = ({label,name,value,onChange,options}) => {
  return (
    <div>
        <label htmlFor={name} className='block text-sm font-medium text-gray-700'>{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>

    </div>
  )
}

export default SelectInput