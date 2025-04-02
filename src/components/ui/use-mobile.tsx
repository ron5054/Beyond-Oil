import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const checkMobile = () => {
      // Check both screen width and user agent
      const isMobileByWidth = window.innerWidth < MOBILE_BREAKPOINT
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
      const isMobileByUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
          userAgent,
        )

      setIsMobile(isMobileByWidth || isMobileByUserAgent)
    }

    const onChange = () => {
      checkMobile()
    }

    mql.addEventListener('change', onChange)
    checkMobile()

    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

export const isMobileFromUserAgent = (userAgent: string): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
    userAgent,
  )
}
