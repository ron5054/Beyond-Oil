'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const Loader = ({ size = 120, speed = 1.5 }) => {
  const [isHovered, setIsHovered] = useState(false)
  const dropletCount = 5
  const baseSize = size / 5

  // Calculate positions in a circle
  const getDropletProps = (index: number) => {
    const angle = index * (360 / dropletCount) * (Math.PI / 180)
    const radius = size / 2 - baseSize / 2

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: index * (speed / dropletCount),
    }
  }

  return (
    <div
      className="relative flex items-center justify-center mx-auto mt-[40vh]"
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container for the rotating droplets */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: dropletCount }).map((_, index) => {
          const { x, y, delay } = getDropletProps(index)

          // Alternate between the two droplet types
          const isGreenDroplet = index % 2 === 0

          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                width: baseSize,
                height: baseSize * 1.4,
                x: 0,
                y: 0,
                originX: '50%',
                originY: '50%',
              }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                scale: [0.6, 1, 0.6],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: speed * 2,
                times: [0, 0.5, 1],
                delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            >
              {isGreenDroplet ? (
                // Green droplet
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 28 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id={`green-gradient-${index}`}
                      x1="27.9637"
                      y1="37.7505"
                      x2="27.9641"
                      y2="-1.54039"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#D8DD2F" />
                      <stop offset="1" stopColor="#4AB849" />
                    </linearGradient>
                  </defs>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.9305 0.850647C13.4312 0.859813 12.9366 1.14346 12.7378 1.7026C9.23279 11.5823 1.32528 15.9846 0.876754 24.2021C0.867857 24.3473 0.863147 24.4934 0.85896 24.6401C0.857913 24.7134 0.850586 24.7862 0.850586 24.8596H0.853726C0.853203 24.8972 0.850586 24.9354 0.850586 24.9741C0.850586 32.0301 6.72954 37.7503 13.9818 37.7503C21.234 37.7503 27.113 32.0301 27.113 24.9741C27.113 24.9354 27.1099 24.8972 27.1093 24.8596H27.113C27.113 24.7862 27.1051 24.7134 27.1041 24.6401C27.0999 24.4934 27.0952 24.3473 27.0863 24.2021C26.6383 15.9877 18.5801 11.5858 15.1782 1.71431C14.9835 1.14855 14.4847 0.860322 13.9807 0.850647H13.9305Z"
                    fill={`url(#green-gradient-${index})`}
                  />
                </svg>
              ) : (
                // Yellow droplet
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 27 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id={`yellow-gradient-${index}`}
                      x1="29.5349"
                      y1="37.3653"
                      x2="29.5349"
                      y2="-7.38575"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#EDE869" />
                      <stop offset="1" stopColor="#FFD400" />
                    </linearGradient>
                  </defs>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M26.7409 24.4743C26.7409 24.401 26.7331 24.3287 26.732 24.2559C26.7284 24.1092 26.7237 23.9625 26.7148 23.8169C26.2662 15.603 18.2085 11.2007 14.8067 1.32924C14.412 0.183976 12.7713 0.175828 12.3662 1.31803C8.86071 11.1976 0.953207 15.5999 0.504684 23.8169C0.495787 23.9625 0.491076 24.1092 0.487413 24.2559C0.485843 24.3287 0.478516 24.401 0.478516 24.4743H0.481656C0.481132 24.5125 0.478516 24.5502 0.478516 24.5889C0.478516 31.6448 6.35746 37.3655 13.6097 37.3655C20.8615 37.3655 26.7409 31.6448 26.7409 24.5889C26.7409 24.5502 26.7378 24.5125 26.7378 24.4743H26.7409Z"
                    fill={`url(#yellow-gradient-${index})`}
                  />
                </svg>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Center droplet */}
      <motion.div
        className="relative"
        style={{
          width: baseSize * 1.2,
          height: baseSize * 1.7,
        }}
        animate={{
          rotate: isHovered ? [0, 360] : 0,
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          rotate: { duration: 2, ease: 'linear' },
          scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 28 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="center-gradient"
              x1="27.9637"
              y1="37.7505"
              x2="27.9641"
              y2="-1.54039"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D8DD2F" />
              <stop offset="1" stopColor="#4AB849" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.9305 0.850647C13.4312 0.859813 12.9366 1.14346 12.7378 1.7026C9.23279 11.5823 1.32528 15.9846 0.876754 24.2021C0.867857 24.3473 0.863147 24.4934 0.85896 24.6401C0.857913 24.7134 0.850586 24.7862 0.850586 24.8596H0.853726C0.853203 24.8972 0.850586 24.9354 0.850586 24.9741C0.850586 32.0301 6.72954 37.7503 13.9818 37.7503C21.234 37.7503 27.113 32.0301 27.113 24.9741C27.113 24.9354 27.1099 24.8972 27.1093 24.8596H27.113C27.113 24.7862 27.1051 24.7134 27.1041 24.6401C27.0999 24.4934 27.0952 24.3473 27.0863 24.2021C26.6383 15.9877 18.5801 11.5858 15.1782 1.71431C14.9835 1.14855 14.4847 0.860322 13.9807 0.850647H13.9305Z"
            fill="url(#center-gradient)"
          />
        </svg>
      </motion.div>
    </div>
  )
}

export default Loader
