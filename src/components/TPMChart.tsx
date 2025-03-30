'use client'
import dynamic from 'next/dynamic'
import { FryerReport } from '@/payload-types'
import { ChartDataItem } from '../../interfaces'

const ChartClient = dynamic(() => import('./ChartClient'), { ssr: true })

const TPMChart = ({ reports }: { reports: { [key: string]: FryerReport[] } }) => {
  // Get all fryer keys from the reports object
  const fryerNames = Object.keys(reports)

  // Create a map of dates to data points
  const dateMap: Map<string, ChartDataItem> = new Map()

  // Process all fryer data
  Object.entries(reports).forEach(([fryerName, fryerReports]) => {
    fryerReports.forEach((report) => {
      const date = new Date(report.createdAt)
      const dateStr = date.toLocaleDateString()

      if (!dateMap.has(dateStr)) {
        // Initialize entry for this date with null tpmLevels for missing data
        dateMap.set(dateStr, {
          date: dateStr,
          createdAt: report.createdAt,
          fryers: fryerNames.map((name) => ({
            name,
            tpmLevel: null,
            type: '',
            itemsFried: '',
            reportedBy: '',
          })),
        })
      }

      // Find the index of the current fryer in the fryerNames array
      const fryerIndex = fryerNames.indexOf(fryerName)
      if (fryerIndex !== -1) {
        // Update the TPM level for this fryer on this date
        const dateEntry = dateMap.get(dateStr)!
        dateEntry.fryers[fryerIndex].tpmLevel = report.tpmLevel

        // Add fryer details and user information
        if (report.fryer && typeof report.fryer !== 'number') {
          dateEntry.fryers[fryerIndex].type = report.fryer.type
          dateEntry.fryers[fryerIndex].itemsFried = report.fryer.itemsFried
        }

        // Add user information
        if (report.createdBy && typeof report.createdBy !== 'number') {
          dateEntry.fryers[fryerIndex].reportedBy = report.createdBy.name || report.createdBy.email
        }
      }
    })
  })

  const chartData = Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  return (
    <div className="w-full h-[400px] p-4 bg-card rounded-lg shadow-sm my-10">
      <h3 className="text-lg font-medium mb-4">TPM Levels</h3>
      {chartData.length > 0 && <ChartClient data={chartData} fryerNames={fryerNames} />}
    </div>
  )
}

export default TPMChart
