import { Check } from 'lucide-react'

interface CheckMarkProps {
  xl?: boolean
}

const CheckMark = ({ xl = false }: CheckMarkProps) => {
  return (
    <div
      className={`flex items-center justify-center ${xl ? 'w-10 h-10' : 'w-6 h-6'} rounded-full bg-green-50`}
    >
      <Check className={`${xl ? 'w-5 h-5' : 'w-3 h-3'} text-green-600`} />
    </div>
  )
}

export default CheckMark
