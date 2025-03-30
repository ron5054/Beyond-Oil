'use client'
import FryerForm from './FryerForm'
import FryerCard from './FryerCard'
import { useState, useCallback, memo } from 'react'
import { AddButton } from './AddButton'
import { FryerCreate } from '../../interfaces'
import { Fryer } from '@/payload-types'

interface FryerListProps {
  fryers: Fryer[]
  branchId: number
  addFryerToBranch: (fryer: FryerCreate) => Promise<false | undefined>
  editFryer: (fryer: Fryer) => Promise<void>
  deleteFryer: (id: number) => Promise<void>
}

// Memoized FryerCard to prevent unnecessary re-renders
const MemoizedFryerCard = memo(FryerCard)

const FryerList: React.FC<FryerListProps> = ({
  fryers,
  branchId,
  addFryerToBranch,
  editFryer,
  deleteFryer,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [fryerToEdit, setFryerToEdit] = useState<Fryer | null>(null)

  const setSelectedFryer = useCallback((fryer: Fryer) => {
    setFryerToEdit(fryer)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setFryerToEdit(null)
  }, [])

  const handleAddFryer = useCallback(
    (fryer: FryerCreate) => {
      return addFryerToBranch(fryer)
    },
    [addFryerToBranch],
  )

  const handleEditFryer = useCallback(
    (fryer: Fryer) => {
      return editFryer(fryer)
    },
    [editFryer],
  )

  return (
    <div className="p-6 border border-gray-200 shadow-sm rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-sm font-bold text-[#212b36]">Fryers</h1>
        <AddButton openDialog={() => setIsOpen(true)} />
      </div>
      {fryers.length > 0 && (
        <ul className="flex flex-col gap-4 mt-6">
          {fryers.map((fryer) => (
            <li className="cursor-pointer" key={fryer.id} onClick={() => setSelectedFryer(fryer)}>
              <MemoizedFryerCard fryer={fryer} onDelete={deleteFryer} />
            </li>
          ))}
        </ul>
      )}
      <FryerForm
        isOpen={isOpen}
        setIsOpen={handleClose}
        branchId={branchId}
        addFryer={handleAddFryer}
        editFryer={handleEditFryer}
        fryerToEdit={fryerToEdit ?? undefined}
      />
    </div>
  )
}

export default memo(FryerList)
