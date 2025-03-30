import Image from 'next/image'

const BranchLogo = ({ logo }: { logo?: string | null | undefined }) => {
  return logo ? (
    <Image
      src={logo}
      alt="Branch Logo"
      width={40}
      height={40}
      className="aspect-square w-[40px] object-fit rounded-full"
    />
  ) : (
    <div className="aspect-square w-[40px] rounded-full bg-gray-200 flex items-center justify-center text-[.5rem]">
      no logo
    </div>
  )
}

export default BranchLogo
