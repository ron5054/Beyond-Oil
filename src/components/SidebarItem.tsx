import Image from 'next/image'

interface SidebarItemProps {
  iconPath: string
  text: string
  isActive: boolean
  onClick: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({ iconPath, text, isActive, onClick }) => {
  return (
    <li
      className={`flex items-center gap-2 text-[#637381] font-medium p-4 rounded-2xl cursor-pointer ${isActive ? 'bg-[#00A76F14]' : ''}`}
      onClick={onClick}
    >
      <Image src={iconPath} alt="Placeholder" width={24} height={24} />
      {text}
    </li>
  )
}

export default SidebarItem
