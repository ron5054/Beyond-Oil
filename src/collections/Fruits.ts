import type { CollectionConfig } from 'payload'

export const Fruits: CollectionConfig = {
  slug: 'fruits',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
