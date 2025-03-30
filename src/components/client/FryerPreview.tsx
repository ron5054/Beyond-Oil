import { Fryer, FryerReport } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import DateDisplay from '@/components/DateDisplay'
import CheckMark from '@/components/CheckMark'
import InfoMark from '@/components/InfoMark'
import ProfileDisplay from '@/components/client/ProfileDisplay'
interface FryerPreviewProps {
  fryer: Fryer
  todayReport?: FryerReport
}

const FryerPreview = ({ fryer, todayReport }: FryerPreviewProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 shadow-sm">
        <section className="flex justify-between">
          <div>
            <h1 className="text-xs font-semibold mb-2">{fryer.name}</h1>
            <h1 className="text-xs font-semibold text-gray-500">
              {fryer.type} - {fryer.itemsFried}
            </h1>
          </div>
          {todayReport ? <CheckMark /> : <InfoMark />}
        </section>

        {todayReport && (
          <div className="flex justify-between text-xs font-normal text-gray-600 mt-4">
            {todayReport.createdAt && <DateDisplay date={todayReport.createdAt} />}
            {todayReport.createdBy && <ProfileDisplay user={todayReport.createdBy} />}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FryerPreview
