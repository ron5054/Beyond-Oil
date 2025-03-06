'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { branchSchema, BranchFormData } from '../../schemas'
import payload from 'payload'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface AddEditBranchFormProps {
  isAddForm: boolean
  addBranch: (branch: BranchFormData) => void
}

const AddEditBranchForm: React.FC<AddEditBranchFormProps> = ({ isAddForm, addBranch }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  })

  const onSubmit = async (data: BranchFormData) => {
    console.log('data', data)

    // setIsSubmitting(true)
    // try {
    //   await payload.create({
    //     collection: 'branches',
    //     data: {
    //       ...data,
    //       country: data.country as 'il' | 'us',
    //     },
    //   })
    //   alert('Branch added successfully!')
    // } catch (error) {
    //   console.error('Error creating branch:', error)
    //   alert('Failed to create branch')
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Add Branch</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Branch Name</Label>
            <Input {...register('branchName')} placeholder="Enter branch name" />
            {errors.branchName && <p className="text-red-500">{errors.branchName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Branch Code</Label>
            <Input {...register('branchCode')} placeholder="Enter branch code" />
            {errors.branchCode && <p className="text-red-500">{errors.branchCode.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input {...register('phoneNumber')} placeholder="Enter phone number" />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input {...register('address')} placeholder="Enter address" />
          </div>
          <div className="space-y-1.5">
            <Label>City</Label>
            <Input {...register('city')} placeholder="Enter city" />
          </div>
          <div className="space-y-1.5">
            <Label>State</Label>
            <Input {...register('state')} placeholder="Enter state" />
          </div>
          <div className="space-y-1.5">
            <Label>Zip Code</Label>
            <Input {...register('zipCode')} placeholder="Enter zip code" />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Select onValueChange={(value) => setValue('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="il">Israel</SelectItem>
                <SelectItem value="us">United States</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isSubmitting ? 'Submitting...' : `${isAddForm ? 'Add' : 'Update'} Branch`}
        </button>
      </form>
    </Card>
  )
}

export default AddEditBranchForm
