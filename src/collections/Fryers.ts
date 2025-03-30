import type { CollectionConfig } from 'payload'

export const Fryers: CollectionConfig = {
  slug: 'fryers',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'itemsFried',
      type: 'select',
      options: [
        { label: 'Chicken', value: 'Chicken' },
        { label: 'French Fries', value: 'French Fries' },
        { label: 'Onion Rings', value: 'Onion Rings' },
        { label: 'Fish', value: 'Fish' },
      ],
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Winston (25L)', value: 'Winston (25L)' },
        { label: 'Frymaster (30L)', value: 'Frymaster (30L)' },
        { label: 'Pitco (20L)', value: 'Pitco (20L)' },
      ],
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
    },
    {
      name: 'lastOilChangeDate',
      type: 'date',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
