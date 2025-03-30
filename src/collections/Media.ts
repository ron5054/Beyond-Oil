import type { CollectionConfig } from 'payload'
import { supabaseStorage } from '../lib/supabaseStorage'

interface MediaDoc {
  id: string
  url?: string
  alt: string
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    disableLocalStorage: true,
    handlers: [
      async (req, { doc, params }) => {
        if (!params.filename || !req.file) return
        const result = await supabaseStorage.upload({
          file: {
            filename: params.filename,
            mimeType: req.file.mimetype,
            buffer: req.file.data,
          },
          data: doc,
        })
        // Update the doc with the URL from Supabase
        if (result && result.url) {
          ;(doc as MediaDoc).url = result.url
        }
      },
      async (req, { params }) => {
        if (!params.filename) return
        await supabaseStorage.delete(params.filename)
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'filename',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'mimeType',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // If we're creating a document directly (not through upload)
        if (!req.file && data.url) {
          return {
            ...data,
            filename: data.url.split('/').pop(),
            mimeType: 'image/jpeg', // Default to jpeg if we can't determine
          }
        }
        return data
      },
    ],
  },
}
