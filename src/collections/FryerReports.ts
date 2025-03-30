import { CollectionConfig } from 'payload'

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to update fryer with retries
async function updateFryerWithRetry(
  payload: any,
  fryerId: string,
  newOilDate: string,
  maxRetries = 3,
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await payload.update({
        collection: 'fryers',
        id: fryerId,
        data: {
          lastOilChangeDate: newOilDate,
        },
      })
      return true
    } catch (error) {
      if (attempt === maxRetries) throw error
      // Exponential backoff: 1s, 2s, 4s
      await delay(Math.pow(2, attempt - 1) * 1000)
    }
  }
  return false
}

export const FryerReports: CollectionConfig = {
  slug: 'fryer-reports',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'fryer',
      type: 'relationship',
      relationTo: 'fryers',
      required: true,
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
      access: {
        create: () => false,
      },
    },
    {
      name: 'newOil',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'newOilDate',
      type: 'date',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tpmLevel',
      type: 'number',
      required: true,
      min: 0,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (operation === 'create' && data.fryer) {
          const payload = req.payload

          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0]

          // Check if a report for the same fryer exists on the same day
          const existingReports = await payload.find({
            collection: 'fryer-reports',
            where: {
              fryer: { equals: data.fryer },
              createdAt: {
                greater_than_equal: today, // Start of the day
              },
            },
          })

          if (existingReports.docs.length > 0) {
            throw new Error('A report for this fryer has already been created today.')
          }
        }

        // Auto-assign createdBy field
        if (req.user) {
          return { ...data, createdBy: req.user.id }
        }
        return data
      },
    ],
  },
}
