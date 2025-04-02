import type { CollectionConfig, Access, Where } from 'payload'

export const Branches: CollectionConfig = {
  slug: 'branches',
  access: {
    read: ({ req, id }) => {
      // If no user is logged in or if user is not authenticated, deny access
      if (!req.user) return false

      // Admins and managers can see all branches
      if (req.user.role === 'admin' || req.user.role === 'manager') return true

      // Chefs can only see their assigned branch
      if (req.user.role === 'chef') {
        // If we're checking for a specific branch by ID
        if (id) {
          // Return true only if this is the chef's assigned branch
          return Boolean(req.user.branch && req.user.branch.toString() === id.toString())
        }

        // For queries (list operations), filter to only show the chef's branch
        if (req.user.branch) {
          // Return a where clause that filters to only the chef's branch
          const where: Where = {
            id: {
              equals: req.user.branch,
            },
          }
          return where
        }
        return false // Chef has no assigned branch
      }

      // Deny access for any other roles
      return false
    },
    create: ({ req }) => {
      const user = req.user
      return Boolean(user && (user.role === 'admin' || user.role === 'manager'))
    },
    update: ({ req }) => {
      const user = req.user
      // Only admins and managers can update branches
      return Boolean(user && (user.role === 'admin' || user.role === 'manager'))
    },
    delete: ({ req }) => {
      const user = req.user
      // Only admins and managers can delete branches
      return Boolean(user && (user.role === 'admin' || user.role === 'manager'))
    },
  },
  fields: [
    {
      name: 'chainName',
      type: 'select',
      options: [
        'KFC',
        'McDonalds',
        'Burger King',
        'Wendys',
        'Taco Bell',
        'Subway',
        'Papa Johns',
        'Other',
      ],
      required: true,
    },
    { name: 'logo', type: 'text' },
    {
      name: 'filterTime',
      type: 'select',
      required: true,
      defaultValue: '12:00',
      options: Array.from({ length: 24 }, (_, i) => ({
        label: `${i}:00`,
        value: `${i}:00`,
      })),
      admin: {
        description: 'Select an hour (0-23)',
      },
    },
    {
      name: 'timezone',
      type: 'select',
      required: true,
      options: [
        { label: 'Jerusalem (GMT+2)', value: 'Jerusalem (GMT+2)' },
        { label: 'New York (GMT-5)', value: 'New York (GMT-5)' },
        { label: 'Los Angeles (GMT-8)', value: 'Los Angeles (GMT-8)' },
        { label: 'Chicago (GMT-6)', value: 'Chicago (GMT-6)' },
        { label: 'Denver (GMT-7)', value: 'Denver (GMT-7)' },
        { label: 'Phoenix (GMT-7, no DST)', value: 'Phoenix (GMT-7, no DST)' },
        { label: 'Anchorage (GMT-9)', value: 'Anchorage (GMT-9)' },
        { label: 'Honolulu (GMT-10)', value: 'Honolulu (GMT-10)' },
      ],
      defaultValue: 'Jerusalem (GMT+2)',
    },
    { name: 'branchName', type: 'text', required: true },
    { name: 'branchCode', type: 'text', required: true },
    { name: 'phoneNumber', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'state', type: 'text' },
    { name: 'zipCode', type: 'text' },
    { name: 'country', type: 'select', options: ['il', 'us'], required: true },
    {
      name: 'manager',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: false,
      admin: {
        description: 'Select a manager from the Users collection',
        isSortable: true,
      },
    },
  ],
}
