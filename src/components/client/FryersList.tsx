'use client'

import DailyReportForm from './DailyReportForm'
import FryerPreview from './FryerPreview'
import { Fryer, FryerReport, DailyMeasurement } from '@/payload-types'
import { useState } from 'react'

const FryersList = ({
  fryers,
  todayReports,
  dailyMeasurements,
  branchId,
  userId,
}: {
  fryers: Fryer[]
  todayReports: FryerReport[]
  dailyMeasurements: DailyMeasurement[]
  branchId: number
  userId: number
}) => {
  const [selectedFryer, setSelectedFryer] = useState<Fryer | null>(null)

  return (
    <div className="w-full py-4">
      {!selectedFryer ? (
        <ul className="flex flex-col gap-4 w-full">
          {fryers.map((fryer) => {
            const matchingReport = todayReports.find((report) => {
              return typeof report.fryer === 'object'
                ? report.fryer?.id === fryer.id
                : report.fryer === fryer.id
            })

            return (
              <li
                key={fryer.id}
                onClick={!matchingReport ? () => setSelectedFryer(fryer) : undefined}
              >
                <FryerPreview fryer={fryer} todayReport={matchingReport} />
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setSelectedFryer(null)}
            className="self-start mb-2 px-2 py-0.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <FryerPreview
            fryer={selectedFryer}
            todayReport={todayReports.find((report) => {
              return typeof report.fryer === 'object'
                ? report.fryer?.id === selectedFryer.id
                : report.fryer === selectedFryer.id
            })}
          />
          <DailyReportForm
            dailyMeasurements={dailyMeasurements}
            selectedFryer={selectedFryer}
            branchId={branchId}
            userId={userId}
            onFormSubmitted={() => setSelectedFryer(null)}
          />
        </div>
      )}
    </div>
  )
}

export default FryersList
