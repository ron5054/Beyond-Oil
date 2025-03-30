// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Branches } from './collections/Branches'
import { Fryers } from './collections/Fryers'
import { DailyMeasurements } from './collections/DailyMeasurements'
import { FoodSamples } from './collections/FoodSamples'
import { FoodSampleReports } from './collections/FoodSamplesReports'
import { FryerReports } from './collections/FryerReports'
import { DailyMeasurementReports } from './collections/DailyMeasurementReports'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Branches,
    Fryers,
    DailyMeasurements,
    FoodSamples,
    FoodSampleReports,
    FryerReports,
    DailyMeasurementReports,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
