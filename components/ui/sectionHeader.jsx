import { UserPlus } from 'lucide-react'
import React from 'react'

export default function SectionHeader({ title, subtitle, Icon }) {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-700 p-2 rounded-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="md:text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
