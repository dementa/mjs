import React from 'react'

export default function SectionHeader({title, subtitle}) {
  return (
    <div className='flex gap-2 h-16'>
        <span className='block h-12 w-1 bg-red-300'></span>
        <div>
            <h1 className=" text-xl md:text-2xl font-semibold text-gray-800">{title}</h1>
            <p className="text-gray-600 font-light text-xs md:text-sm">{subtitle}</p>
        </div>
    </div>
  )
}
