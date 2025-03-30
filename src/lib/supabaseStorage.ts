import { createClient } from '@supabase/supabase-js'

interface FileData {
  filename: string
  mimeType: string
  buffer: Buffer
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export const supabaseStorage = {
  upload: async ({ file, data }: { file: FileData; data: any }) => {
    try {
      const { filename, mimeType, buffer } = file

      // Upload the file to Supabase storage
      const { data: uploadData, error } = await supabase.storage
        .from('images')
        .upload(`media/${filename}`, buffer, {
          contentType: mimeType,
          upsert: true,
          cacheControl: '3600',
        })

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

      // Get the public URL for the uploaded file
      const { data: publicUrl } = supabase.storage
        .from('images')
        .getPublicUrl(`media/${filename}`, {
          transform: {
            width: 600,
            height: 800,
            resize: 'cover',
          },
        })

      // Return the file information
      return {
        filename,
        url: publicUrl.publicUrl,
        mimeType,
      }
    } catch (error) {
      console.error('Storage upload error:', error)
      throw error
    }
  },

  delete: async (filename: string) => {
    try {
      const { error } = await supabase.storage.from('images').remove([`media/${filename}`])

      if (error) {
        console.error('Delete error:', error)
        throw error
      }
    } catch (error) {
      console.error('Storage delete error:', error)
      throw error
    }
  },
}
