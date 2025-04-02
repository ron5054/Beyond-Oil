'use client'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { DeleteButton } from './DeleteButton'
import { FoodSample } from '@/payload-types'
import { toggle } from '@/lib/crudActions'
import { Switch } from '@/components/ui/switch'

interface FoodSampleCardProps {
  foodSample: FoodSample
  onDelete: (id: number) => Promise<void>
}

const FoodSampleCard: React.FC<FoodSampleCardProps> = ({
  foodSample: { id, name, isActive },
  onDelete,
}) => {
  const [active, setActive] = useState(isActive)

  const handleToggle = async (checked: boolean) => {
    try {
      toggle('foodSamples', id, checked)
      setActive(checked)
    } catch (error) {
      console.error('Error toggling food sample:', error)
    }
  }

  return (
    <Card className="w-full shadow-sm !border-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{name}</span>
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

export default FoodSampleCard
