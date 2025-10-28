"use client"
import { HomeIcon, User, UserRoundCogIcon, Users2 } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
import { useState } from 'react';

const SampleData = [
  {
    id: 1,
    title: "Learners",
    count: 1068,
    filters: [
      { id: 'all', title: 'All' },
      { id: 'nursery', title: 'Nursery' },
      { id: 'primary', title: 'Primary' },
      { id: 'secondary', title: 'Secondary' }
    ],
    icon: <Users2 className='text-white w-6 h-6' />
  },
  {
    id: 2,
    title: "Staff",
    count: 87,
    filters: [
      { id: 'all', title: 'All' },
      { id: 'teaching', title: 'Teaching' },
      { id: 'non-teaching', title: 'Non-Teaching' }
    ],
    icon: <Users2 className='text-white w-6 h-6' />
  },
  {
    id: 3,
    title: "Reports",
    count: 50,
    filters: [
      { id: 'all', title: 'All' },
      { id: 'academic', title: 'Academic' },
      { id: 'supervision', title: 'Supervision' },
    ],
    icon: <User className='text-white w-6 h-6' />
  },
  {
    id: 4,
    title: "Classes",
    count: 36,
    filters: [
      { id: 'all', title: 'All' },
      { id: 'nursery', title: 'Nursery' },
      { id: 'primary', title: 'Primary' },
    ],
    icon: <HomeIcon className='text-white w-6 h-6' />
  },
];

export default function InfoCardArea() {
  return (
    <div className='w-full p-8 bg-gray-600 h-fit py-16 text-gray-50'>

        <div className='w-full grid grid-cols-6 md:grid-cols-12 gap-4'>
            {
                SampleData.map(({id, count, title, filters, icon}) => (
                      <InfoCard key={id} id={id} count={count} title={title} filters={filters} icon={icon} />
                ))
            }
        </div>
    </div>
  )
}

const InfoCard = ({id, count, title, filters, icon}) => {
    const [activeFilter, setActiveFilter] = useState('all');
    return (
        <div className='col-span-6 md:col-span-3 bg-gray-100 p-4 rounded-lg shadow-md md:min-w-72'>
            <a href={`/admin/${title.toLowerCase().replace(/ /g, '-')}`}>
              <div className='flex items-center justify-between'>
                  <div className='leading-tight mb-4 flex flex-col items-start'>
                      <p className='text-4xl font-semibold text-gray-800'>{`${count}`}</p>
                      <p className='text-gray-600'>{`${title?.toUpperCase()}`}</p>
                  </div>
                  <div className='leading-tight mb-4 flex flex-col items-center'>
                      <span className='bg-gray-600 rounded-full p-4'>
                          {icon}
                      </span>
                  </div>
              </div>
            </a>
            <div className="flex gap-0.5 text-xs ">
                {filters && filters.map(({id, title}) => (
                  <FilterBtn key={id} id={id} title={title} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                ))}
            </div>
        </div>
    )
}

const FilterBtn = ({ id, title, activeFilter, setActiveFilter }) => {
    const isActive = activeFilter === id;
    const handleClick = () => {
        setActiveFilter(id);
        console.log(`Filter set to: ${id}`);
    };
    return (
        <div onClick={handleClick} className={`scale-90 cursor-pointer py-1 px-2 rounded-md ${isActive ? 'bg-red-600' : 'text-gray-500 bg-gray-300'}`}>
            {title}
        </div>
    );
};