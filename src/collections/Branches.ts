import type { CollectionConfig } from 'payload'

export const Branches: CollectionConfig = {
  slug: 'branches',
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    { name: 'branchName', type: 'text', required: true },
    { name: 'branchCode', type: 'text', required: true },
    { name: 'phoneNumber', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'state', type: 'text' },
    { name: 'zipCode', type: 'text' },
    { name: 'country', type: 'select', options: ['il', 'us'], required: true },
  ],
}
