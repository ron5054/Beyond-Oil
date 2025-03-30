import {
  Branch,
  Fryer,
  DailyMeasurement,
  FoodSample,
  DailyMeasurementReport,
  FryerReport,
  FoodSampleReport,
} from '@/payload-types'

export type BranchCreate = Omit<Branch, 'id' | 'updatedAt' | 'createdAt'>

export type FryerCreate = Omit<Fryer, 'id' | 'updatedAt' | 'createdAt'>

export type DailyMeasurementCreate = Omit<DailyMeasurement, 'id' | 'updatedAt' | 'createdAt'>

export type FoodSampleCreate = Omit<FoodSample, 'id' | 'updatedAt' | 'createdAt'>

export type DailyMeasurementsReportCreate = Omit<
  DailyMeasurementReport,
  'id' | 'updatedAt' | 'createdAt'
>

export type FryerReportCreate = Omit<FryerReport, 'id' | 'updatedAt' | 'createdAt'>

export type FoodSampleReportCreate = Omit<FoodSampleReport, 'id' | 'updatedAt' | 'createdAt'>

export type ErrorResponse = {
  error: string
  status: number
}

export interface DailyReportResults {
  fryerReport: FryerReport | ErrorResponse | null
  dailyMeasurementReports: (DailyMeasurementReport | ErrorResponse)[]
  foodSampleReports: (FoodSampleReport | ErrorResponse)[]
}

export type ChartFryer = {
  name: string
  tpmLevel: number | null
  type: string
  itemsFried: string
  reportedBy: string
}

export type ChartDataItem = {
  date: string
  createdAt: string
  fryers: ChartFryer[]
}

export type ChartProps = {
  data: ChartDataItem[]
  fryerNames: string[]
}
