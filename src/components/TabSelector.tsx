'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchParamsWrapper from './client/SearchParamsWrapper'

const TabSelectorContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab')
    return tabParam || 'branch'
  })

  const tabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'branch', label: 'Branch' },
    { id: 'members', label: 'Members' },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', activeTab)
    router.push(`?${params.toString()}`, { scroll: false })
  }, [activeTab, router, searchParams])

  return (
    <div className="text-black max-w-max">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`#${tab.id}`}
            className={cn(
              'inline-flex items-center px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700',
              activeTab === tab.id && 'border-b-2 border-primary text-gray-900',
            )}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

// Wrapper component that handles the Suspense boundary
const TabSelector = () => {
  return (
    <SearchParamsWrapper>
      <TabSelectorContent />
    </SearchParamsWrapper>
  )
}

export default TabSelector
