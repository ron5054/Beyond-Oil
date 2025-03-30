// 'use client'
import Image from 'next/image'
import { FoodSampleReport } from '@/payload-types'
import { Card, CardFooter } from '@/components/ui/card'

import ProfileDisplay from '@/components/client/ProfileDisplay'
import DateDisplay from '@/components/DateDisplay'

interface FoodSampleReportCardProps {
  foodSampleReport: FoodSampleReport
}

const FoodSampleReportCard = ({ foodSampleReport }: FoodSampleReportCardProps) => {
  const { createdAt, image, user, name, fryer } = foodSampleReport

  return (
    <Card className="flex w-full max-w-md flex-col overflow-hidden bg-white shadow-sm p-2 !rounded-xl">
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      <CardFooter className="flex flex-1 flex-col items-start gap-2 px-2 pt-4 pb-2">
        <div className="flex w-full items-center gap-x-2">
          <DateDisplay date={createdAt} />
          <ProfileDisplay user={user} />
        </div>

        <div className="mt-auto flex w-full items-center justify-between">
          <div className="flex justify-between w-full">
            <h3 className="text-base font-medium text-gray-800">{name}</h3>
            {fryer && typeof fryer === 'object' && (
              <h3 className="text-base font-medium text-gray-800">{fryer.name}</h3>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FoodSampleReportCard
