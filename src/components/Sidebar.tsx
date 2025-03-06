import SidebarItem from './SidebarItem'
const Sidebar = () => {
  const items = [
    { text: 'Overview', iconPath: '/overview.svg' },
    { text: 'Daily input', iconPath: '/dailyInput.svg' },
    { text: 'Stats', iconPath: '/stats.svg' },
    { text: 'Settings', iconPath: '/settings.svg' },
  ]

  return (
    <ul className="flex flex-col gap-2 mt-4">
      {items.map((item, index) => (
        <SidebarItem key={index} {...item} />
      ))}
    </ul>
  )
}

export default Sidebar
