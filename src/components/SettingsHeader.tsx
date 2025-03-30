import TabSelector from '@/components/TabSelector'

const SettingsHeader = () => {
  return (
    <div className="sticky top-0 bg-white z-10 py-6">
      <h1 className="text-2xl font-bold text-[#212b36]">Settings</h1>
      <TabSelector />
    </div>
  )
}

export default SettingsHeader
