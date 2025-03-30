import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  access: {
    read: ({ req, id }) => {
      // Admins can read all users
      if (req.user?.role === 'admin') return true

      // Managers can read themselves and chefs
      if (req.user?.role === 'manager') {
        // Check if the user being accessed is a chef or if it's the manager themselves
        if (req.user.id === id) return true

        return false // Default to false for now, as we can't directly check other users' roles
      }

      // Chefs can only read themselves
      if (req.user?.role === 'chef') {
        return req.user.id === id
      }

      return false
    },
    create: ({ req }) => {
      // Only admins and managers can create new users
      return req.user?.role === 'admin' || req.user?.role === 'manager'
    },
    delete: ({ req }) => {
      // Only admins and managers can delete users
      return req.user?.role === 'admin' || req.user?.role === 'manager'
    },
    update: ({ req, id, data }) => {
      // Admins can update any user
      if (req.user?.role === 'admin') return true

      // Managers can update themselves and chefs but cannot promote themselves to admin
      if (req.user?.role === 'manager') {
        const isUpdatingSelf = req.user.id === id
        const isUpdatingChef = data?.role === 'chef'

        if (isUpdatingSelf || isUpdatingChef) {
          return data?.role !== 'admin' // Ensure they are not promoting anyone to admin
        }
      }

      // Chefs can update only themselves but cannot promote themselves to manager or admin
      if (req.user?.role === 'chef' && req.user.id === id) {
        return data?.role !== 'manager' && data?.role !== 'admin'
      }

      return false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'manager', 'chef'],
      required: true,
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      hasMany: false,
      required: false,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'otp',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'otpExpires',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
