import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartDataItem, ChartProps } from '../../interfaces'

const chartColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  '#FF8042',
  '#00C49F',
  '#FFBB28',
  '#0088FE',
  '#8884d8',
  '#82ca9d',
]

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{
    dataKey: string | number
    name: string
    value: any
    payload: ChartDataItem
    color: string
  }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 rounded-lg shadow-lg text-sm z-50">
        <div className="font-semibold text-xs mb-2">{label}</div>
        <div className="space-y-2">
          {payload.map((entry, index) => {
            if (!entry.payload) return null

            // Get the fryer index from the dataKey (format: "fryers[index].tpmLevel")
            const dataKey = entry.dataKey as string
            const match = dataKey.match(/fryers\[(\d+)\]\.tpmLevel/)
            if (!match) return null

            const fryerIndex = parseInt(match[1], 10)
            const fryer = entry.payload.fryers[fryerIndex]

            if (fryer.tpmLevel === null) return null

            return (
              <div key={index} className={index > 0 ? 'pt-2 border-t border-black' : ''}>
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-xs" style={{ color: entry.color }}>
                    {fryer.name}
                  </div>

                  {fryer.type && (
                    <div className="text-xs text-gray-500">
                      {fryer.type} - {fryer.itemsFried}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">TPM: {fryer.tpmLevel}</div>
                  {fryer.reportedBy && (
                    <div className="text-xs text-gray-500">Employee: {fryer.reportedBy}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}

const ChartClient = ({ data, fryerNames }: ChartProps) => (
  <ResponsiveContainer width="100%" height="85%">
    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis dataKey="date" tick={{ fill: 'var(--foreground)', fontSize: 12 }} tickMargin={10} />
      <YAxis domain={[0, 60]} tick={{ fill: 'var(--foreground)', fontSize: 12 }} tickMargin={10} />
      <Tooltip content={<CustomTooltip />} />

      {fryerNames.map((fryerName, index) => (
        <Area
          key={fryerName}
          type="monotone"
          dataKey={`fryers[${index}].tpmLevel`}
          name={fryerName}
          stroke={chartColors[index % chartColors.length]}
          fill={chartColors[index % chartColors.length]}
          fillOpacity={0.05}
          connectNulls={true}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
)

export default ChartClient
