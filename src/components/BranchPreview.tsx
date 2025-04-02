import { Branch, FryerReport } from '@/payload-types'
import BranchContextMenu from './BranchContextMenu'
import Image from 'next/image'
import BranchLogo from './BranchLogo'

interface BranchPreviewProps {
  branch: Branch
  fryersNum: number
  todayBranchReports: FryerReport[]
  yesterdaysBranchReports: FryerReport[]
}

const renderMeasurementPill = (completed: number, total: number) => {
  let bgColor = 'bg-green-100 text-green-800'

  if (!completed) bgColor = 'bg-red-100 text-red-800'
  else if (completed < total) bgColor = 'bg-yellow-100 text-yellow-800'

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
    >
      {completed}/{total}
    </div>
  )
}

const BranchPreview = ({
  branch,
  fryersNum,
  todayBranchReports,
  yesterdaysBranchReports,
}: BranchPreviewProps) => {
  const showTPMAlert = (
    todayBranchReports: FryerReport[],
    yesterdaysBranchReports: FryerReport[],
  ) => {
    const tpmAlertThreshold = 6
    if (!todayBranchReports.length || !yesterdaysBranchReports.length) return false

    const todayReportsByFryerId = new Map(
      todayBranchReports.map((report) => {
        const fryerId = typeof report.fryer === 'object' ? report.fryer.id : report.fryer
        return [fryerId, report]
      }),
    )

    for (const yesterdayReport of yesterdaysBranchReports) {
      const fryerId =
        typeof yesterdayReport.fryer === 'object' ? yesterdayReport.fryer.id : yesterdayReport.fryer
      const todayReport = todayReportsByFryerId.get(fryerId)

      if (todayReport) {
        const tpmDifference = todayReport.tpmLevel - yesterdayReport.tpmLevel
        return tpmDifference >= tpmAlertThreshold
      }
    }

    return false
  }

  const hasTpmSpike = showTPMAlert(todayBranchReports, yesterdaysBranchReports)

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <BranchLogo logo={branch.logo} />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{branch.branchName}</div>
            <div className="text-sm text-gray-500">{branch.chainName}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {renderMeasurementPill(todayBranchReports.length, fryersNum)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {hasTpmSpike && (
          <div className="inline-flex items-center bg-[#fff1d6] text-[#b76e00] font-medium text-xs p-2 rounded-md">
            TPM Spike Detected
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <BranchContextMenu branch={branch} />
      </td>
    </tr>
  )
}

export default BranchPreview
