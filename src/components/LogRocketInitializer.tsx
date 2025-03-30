'use client'

import { useEffect } from 'react'
import LogRocket from 'logrocket'

export default function LogRocketInitializer() {
  useEffect(() => {
    // Only initialize LogRocket in production to avoid logging during development
    if (process.env.NODE_ENV === 'production') {
      const projectId = process.env.NEXT_PUBLIC_LOGROCKET_PROJECT_ID

      if (projectId) {
        LogRocket.init(projectId)
      } else {
        console.warn(
          'LogRocket project ID is not defined. Please check your environment variables.',
        )
      }
    }
  }, [])

  return null
}
