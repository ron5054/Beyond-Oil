'use client'
import { FoodSampleReport, FoodSample } from '@/payload-types'
import FoodSampleReportCard from './FoodSampleReportCard'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FoodSampleReportListProps {
  foodSampleReports: FoodSampleReport[]
  foodSamplesNeeded: FoodSample[]
}

const FoodSampleReportList = ({
  foodSampleReports,
  foodSamplesNeeded,
}: FoodSampleReportListProps) => {
  const foodSamplesCompleted = foodSampleReports.filter((report) => !report.fryer)

  const missingCount = foodSamplesNeeded.length - foodSamplesCompleted.length
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    if (currentIndex + 3 < foodSampleReports.length) {
      setCurrentIndex(currentIndex + 3)
    }
  }

  const handlePrevious = () => {
    if (currentIndex - 3 >= 0) {
      setCurrentIndex(currentIndex - 3)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-semibold text-[#212b36] mb-2">Daily images</h1>
        {foodSampleReports.length > 3 && (
          <div className="flex gap-2 text-gray-800">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex + 3 >= foodSampleReports.length}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      {missingCount > 0 && (
        <div className="bg-[#fff1d6] text-[#b76e00] font-medium text-xs p-2 rounded-md mb-4 inline-block">
          Missing {missingCount}/{foodSamplesNeeded.length} Food Samples
        </div>
      )}
      <div className="flex gap-4 max-w-[1500px]">
        {foodSampleReports.slice(currentIndex, currentIndex + 3).map((report) => (
          <FoodSampleReportCard key={report.id} foodSampleReport={report} />
        ))}
      </div>
    </div>
  )
}

export default FoodSampleReportList
