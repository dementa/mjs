import React from 'react'
import UnderConstruction from '@/components/UC';
import InfoCardArea from '@/components/infoCards';
import LearnersTable from '@/components/tables/clientsTable';
import StudentSummary from '@/components/charts/studentSummary';
import studentsData from '@/Data/students.json';
import EventManagementSystem from '@/components/eventManagementSystem';
import AdmissionSystem from '@/components/admissions';

export default function Dashboard() {
  return (
    <div className='flex flex-col'>
      <InfoCardArea />
      <StudentSummary data={studentsData} />
      <LearnersTable />
      {/* <EventManagementSystem /> */}
      {/* <UnderConstruction /> */}
      {/* <AdmissionSystem /> */}
    </div>
  )
}
