'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CheckMark from './CheckMark'
import InfoMark from './InfoMark'
import { FryerReport, Fryer } from '@/payload-types'
import Image from 'next/image'
import { useState } from 'react'
import { differenceInDays, subDays } from 'date-fns'

interface FryerDashboardProps {
  todayReports: FryerReport[]
  yesterdayReports: FryerReport[]
  branchFryers: Fryer[]
}

const FryerDashboard = ({ todayReports, yesterdayReports, branchFryers }: FryerDashboardProps) => {
  const [selectedDay, setSelectedDay] = useState('today')

  const getTpmLevelDiff = (fryerId: number) => {
    const todayReport = todayReports.find((report) =>
      typeof report.fryer === 'object' ? report.fryer.id === fryerId : report.fryer === fryerId,
    )
    const yesterdayReport = yesterdayReports.find((report) =>
      typeof report.fryer === 'object' ? report.fryer.id === fryerId : report.fryer === fryerId,
    )

    if (todayReport?.tpmLevel && yesterdayReport?.tpmLevel) {
      return todayReport.tpmLevel - yesterdayReport.tpmLevel
    }
    return null
  }

  const matchingReport = (fryerId: number) => {
    const reportsToCheck = selectedDay === 'today' ? todayReports : yesterdayReports
    return reportsToCheck.find((report) =>
      typeof report.fryer === 'object' ? report.fryer.id === fryerId : report.fryer === fryerId,
    )
  }

  const getOilChangeStatus = (fryer: Fryer) => {
    if (!fryer.lastOilChangeDate) return null

    const referenceDate = selectedDay === 'today' ? new Date() : subDays(new Date(), 1)
    const lastOilChangeDate = new Date(fryer.lastOilChangeDate)

    if (lastOilChangeDate > referenceDate) return null

    const daysSinceLastOilChange = differenceInDays(referenceDate, lastOilChangeDate)

    if (daysSinceLastOilChange === 0) {
      return 'Oil was changed today'
    } else if (daysSinceLastOilChange === 1) {
      return 'Oil was changed yesterday'
    } else {
      return `${daysSinceLastOilChange} days since last oil change`
    }
  }

  return (
    <>
      {branchFryers.length > 0 ? (
        <div className="pt-6 px-6 bg-white rounded-lg shadow-sm my-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Fryers</h1>
            <Select defaultValue="today" onValueChange={(value) => setSelectedDay(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Today" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ul>
            {branchFryers.map((fryer) => {
              const tmpDiff = getTpmLevelDiff(fryer.id)
              const isIncreasing = tmpDiff !== null ? tmpDiff > 0 : null
              const oilChangeStatus = getOilChangeStatus(fryer)

              return (
                <li key={fryer.id} className="flex items-center border-t border-gray-200 py-6">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h2 className="text-md font-medium text-gray-900">{fryer.name}</h2>
                      {tmpDiff !== null && (
                        <span className="flex gap-1 items-center ml-2 px-1 py-0.5 text-sm bg-gray-100 text-black p-2 rounded font-bold">
                          {Math.abs(+tmpDiff?.toFixed(1))} TMP
                          <Image
                            src={isIncreasing ? '/upArrow.svg' : '/downArrow.svg'}
                            alt="Up Arrow"
                            width={18}
                            height={18}
                          />
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {fryer.type} - {fryer.itemsFried}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {oilChangeStatus && (
                      <div className="bg-[#fff1d6] text-[#b76e00] font-medium text-xs p-2 rounded-md">
                        {oilChangeStatus}
                      </div>
                    )}
                    {matchingReport(fryer.id) ? (
                      <CheckMark xl />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="bg-[#fff1d6] text-[#b76e00] font-medium text-xs p-2 rounded-md">
                          Not Measured
                        </div>
                        <InfoMark xl />
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div className="text-gray-500 p-6 rounded-lg shadow-sm my-6">No fryers found</div>
      )}
    </>
  )
}

export default FryerDashboard
