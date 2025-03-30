'use client'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { toggle } from '@/lib/crudActions'
import { DailyMeasurement } from '@/payload-types'
import { DeleteButton } from './DeleteButton'

interface DailyMeasurementCardProps {
  inputForm: DailyMeasurement
  onDelete: (id: number) => Promise<void>
}

const DailyMeasurementCard: React.FC<DailyMeasurementCardProps> = ({
  inputForm: { id, name, type, isActive, label },
  onDelete,
}) => {
  const [active, setActive] = useState(isActive)

  const handleToggle = async (checked: boolean) => {
    try {
      await toggle('dailyMeasurements', id, checked)
      setActive(checked)
    } catch (error) {
      console.error('Error toggling input form:', error)
    }
  }

  return (
    <Card className="w-full shadow-sm !border-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Name:</span>
              <span className="font-medium">{name}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Type:</span>
              <span>{type}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Label:</span>
              <span>{label}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2" onClick={(ev) => ev.stopPropagation()}>
            <DeleteButton onDelete={() => onDelete(id)} />
            <Switch
              checked={active}
              onCheckedChange={(checked) => handleToggle(checked)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DailyMeasurementCard
