import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: ({ req }) => {
      // Only admins can create new users
      return req.user?.isAdmin === true
    },
    delete: ({ req }) => {
      // Only admins can delete users
      return req.user?.isAdmin === true
    },
    update: ({ req, id, data }) => {
      // Admins can update any user
      if (req.user?.isAdmin) return true

      // Managers can update themselves and chefs but cannot promote themselves to admin
      if (req.user?.isManager) {
        const isUpdatingSelf = req.user.id === id
        const isUpdatingChef = data?.isChef && !data?.isAdmin && !data?.isManager

        if (isUpdatingSelf || isUpdatingChef) {
          return !data?.isAdmin // Ensure they are not promoting anyone to admin
        }
      }

      // Chefs can update only themselves but cannot promote themselves to manager or admin
      if (req.user?.isChef && req.user.id === id) {
        return !data?.isManager && !data?.isAdmin
      }

      return false
    },
    read: ({ req }) => {
      // Any authenticated user can read the user list
      return !!req.user
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'isManager',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isChef',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
