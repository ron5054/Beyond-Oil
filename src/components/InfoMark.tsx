import { Info } from 'lucide-react'

interface InfoMarkProps {
  xl?: boolean
}

const InfoMark = ({ xl = false }: InfoMarkProps) => {
  return (
    <div
      className={`flex items-center justify-center ${xl ? 'w-10 h-10' : 'w-6 h-6'} rounded-full bg-[#fff1d6]`}
    >
      <Info className={`${xl ? 'w-5 h-5' : 'w-3 h-3'} !text-[#b76e00]`} />
    </div>
  )
}

export default InfoMark
