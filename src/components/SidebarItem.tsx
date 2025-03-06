import Image from 'next/image'

interface SidebarItemProps {
  iconPath: string
  text: string
  isActive?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ iconPath, text, isActive }) => {
  return (
    <li className="flex items-center gap-2 text-black p-4 rounded-2xl bg-[#00A76F14]">
      <Image src={iconPath} alt="Placeholder" width={24} height={24} />
      {text}
    </li>
  )
}

export default SidebarItem
