import { FoodSampleReport } from '@/payload-types'
import Image from 'next/image'
import DateDisplay from '@/components/DateDisplay'
import ProfileDisplay from './ProfileDisplay'

interface SubmittedFoodSampleCardProps {
  report: FoodSampleReport
  sampleName: string
}

const SubmittedFoodSampleCard = ({ report, sampleName }: SubmittedFoodSampleCardProps) => {
  const { image } = report
  return (
    <div className="flex flex-col text-green-600 text-xs">
      <div className="relative w-full h-[88px]">
        <Image
          src={image}
          alt={`Submitted image for ${sampleName}`}
          fill
          className="object-cover rounded-md border border-gray-200"
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-gray-600">
        {report.createdAt && <DateDisplay date={report.createdAt} />}
        <ProfileDisplay user={report.user} />
      </div>
    </div>
  )
}

export default SubmittedFoodSampleCard
