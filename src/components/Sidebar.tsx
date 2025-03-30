'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SidebarItem from './SidebarItem'
import SearchParamsWrapper from './client/SearchParamsWrapper'

type SidebarItemType = {
  text: string
  iconPath: string
  link: string
}

const SidebarContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeItem, setActiveItem] = useState<SidebarItemType | null>(null)

  const items = useMemo(
    () => [
      { text: 'Overview', iconPath: '/overview.svg', link: '/dashboard/overview' },
      { text: 'Daily input', iconPath: '/dailyInput.svg', link: '/dashboard/daily-input' },
      // { text: 'Stats', iconPath: '/stats.svg', link: '/dashboard/stats' },
      { text: 'Settings', iconPath: '/settings.svg', link: '/dashboard/settings' },
    ],
    [],
  )

  const handleItemClick = (item: SidebarItemType) => {
    setActiveItem(item)
    const currentParams = searchParams.toString()
    const targetUrl = currentParams ? `${item.link}?${currentParams}` : item.link

    router.push(targetUrl)
  }

  useEffect(() => {
    const currentPath = window.location.pathname
    const matchingItem = items.find((item) => item.link === currentPath)
    if (matchingItem) setActiveItem(matchingItem)
  }, [items, searchParams])

  return (
    <nav aria-label="Dashboard navigation">
      <ul className="flex flex-col gap-2 mt-4">
        {items.map((item) => (
          <SidebarItem
            key={item.text}
            {...item}
            isActive={item.text === activeItem?.text}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </ul>
    </nav>
  )
}

// Wrapper component that handles the Suspense boundary
const Sidebar = () => {
  return (
    <SearchParamsWrapper>
      <SidebarContent />
    </SearchParamsWrapper>
  )
}

export default Sidebar
