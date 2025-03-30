import { Calendar } from 'lucide-react'

const DateDisplay = ({ date }: { date: string }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'

    const dateObj = new Date(dateString)
    const day = dateObj.getDate()
    const month = dateObj.toLocaleString('en-US', { month: 'short' })
    const year = dateObj.getFullYear()
    const hour = dateObj.getHours()
    const minute = dateObj.getMinutes().toString().padStart(2, '0')
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12

    return `${day} ${month} ${year} ${hour12}:${minute} ${ampm}`
  }
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-2 rounded-md">
      <Calendar className="w-5 h-5 text-gray-500" />
      <span className="text-xs font-normal">{formatDate(date)}</span>
    </div>
  )
}

export default DateDisplay
