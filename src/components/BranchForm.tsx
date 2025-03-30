'use client'
import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
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
import { addBranch } from '@/lib/branchActions'
import { update } from '@/lib/crudActions'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Branch, User } from '@/payload-types'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface BranchFormProps {
  isAddForm: boolean
  onFormChange?: (values: any) => void
  branch?: Branch | null
  onUpdate?: () => void
  users?: User[]
}

const BranchForm: React.FC<BranchFormProps> = ({
  isAddForm,
  onFormChange,
  branch,
  onUpdate,
  users = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  type FilterTime =
    | '0:00'
    | '1:00'
    | '2:00'
    | '3:00'
    | '4:00'
    | '5:00'
    | '6:00'
    | '7:00'
    | '8:00'
    | '9:00'
    | '10:00'
    | '11:00'
    | '12:00'
    | '13:00'
    | '14:00'
    | '15:00'
    | '16:00'
    | '17:00'
    | '18:00'
    | '19:00'
    | '20:00'
    | '21:00'
    | '22:00'
    | '23:00'
  const filterTimes = Array.from({ length: 24 }, (_, i) => `${i}:00`) as FilterTime[]

  type FormValues = {
    branchName: string
    branchCode: string
    phoneNumber: string
    address: string
    city: string
    state: string
    zipCode: string
    country: 'il' | 'us'
    chain: string
    logo: string
    filterTime: Branch['filterTime']
    manager: Branch['manager']
    timezone: Branch['timezone']
  }

  // @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error
  const form = useForm({
    defaultValues: {
      branchName: branch?.branchName || '',
      branchCode: branch?.branchCode || '',
      phoneNumber: branch?.phoneNumber || '',
      address: branch?.address || '',
      city: branch?.city || '',
      state: branch?.state || '',
      zipCode: branch?.zipCode || '',
      country: branch?.country || 'il',
      chain: branch?.chain || '',
      logo: branch?.logo || '',
      filterTime: branch?.filterTime || '12:00',
      manager: branch?.manager || null,
      timezone: branch?.timezone || 'Jerusalem (GMT+2)',
    } as FormValues,
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        if (isAddForm) {
          await addBranch('branches', value)
          toast.success('Branch added successfully!')
          setOpen(false)
        } else {
          if (!branch?.id) throw new Error('No branch id for update')
          const { id, updatedAt, createdAt, ...updateData } = {
            ...value,
            id: branch.id,
            updatedAt: branch.updatedAt,
            createdAt: branch.createdAt,
          }
          await update('branches', id, updateData)
          toast.success('Branch updated successfully!')
        }
      } catch (error) {
        console.error(`Error ${isAddForm ? 'creating' : 'updating'} branch:`, error)
        toast.error(`Failed to ${isAddForm ? 'create' : 'update'} branch`)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (!isAddForm && onFormChange) {
      onFormChange(form.state.values)
    }
  }, [form.state.values, isAddForm, onFormChange])

  const formContent = (
    <Card className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="branchName">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Branch Name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter branch name"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="branchCode">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Branch Code
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter branch code"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="phoneNumber">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Phone Number
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter phone number"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="address">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Address
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter address"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="city">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    City
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter city"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="state">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    State
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter state"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="zipCode">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Zip Code
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter zip code"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="country">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Country
                  </Label>
                  <Select
                    value={field.state.value as 'il' | 'us'}
                    onValueChange={(val: 'il' | 'us') => field.handleChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="il">Israel</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="chain">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Chain
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter chain"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="logo">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Logo
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter logo URL/path"
                  />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="manager">
              {(field) => {
                // Handle cases where manager is a User object or just an ID
                const managerId =
                  typeof field.state.value === 'object' ? field.state.value?.id : field.state.value

                return (
                  <>
                    <Label htmlFor={field.name} className="text-gray-500">
                      Manager
                    </Label>
                    <Select
                      value={managerId?.toString() || 'none'}
                      onValueChange={(val) =>
                        field.handleChange(val === 'none' ? null : Number(val))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {users
                          ?.filter((user) => user.role === 'manager' || user.role === 'admin')
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </>
                )
              }}
            </form.Field>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <h3 className="text-lg font-medium mb-3">Daily filter time</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="timezone">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Timezone
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: Branch['timezone']) => field.handleChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jerusalem (GMT+2)">Jerusalem (GMT+2)</SelectItem>
                      <SelectItem value="New York (GMT-5)">New York (GMT-5)</SelectItem>
                      <SelectItem value="Los Angeles (GMT-8)">Los Angeles (GMT-8)</SelectItem>
                      <SelectItem value="Chicago (GMT-6)">Chicago (GMT-6)</SelectItem>
                      <SelectItem value="Denver (GMT-7)">Denver (GMT-7)</SelectItem>
                      <SelectItem value="Phoenix (GMT-7, no DST)">
                        Phoenix (GMT-7, no DST)
                      </SelectItem>
                      <SelectItem value="Anchorage (GMT-9)">Anchorage (GMT-9)</SelectItem>
                      <SelectItem value="Honolulu (GMT-10)">Honolulu (GMT-10)</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-1.5">
            {/* @ts-ignore - Workaround for "Type instantiation is excessively deep and possibly infinite" error */}
            <form.Field name="filterTime">
              {(field) => (
                <>
                  <Label htmlFor={field.name} className="text-gray-500">
                    Filter Time
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: Branch['filterTime']) => field.handleChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter time" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterTimes.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </form.Field>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          {isAddForm ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isSubmitting ? 'Submitting...' : 'Add Branch'}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#1C252E] text-white rounded cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          )}
        </div>
      </form>
    </Card>
  )

  return isAddForm ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-md transition-colors cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        {formContent}
      </DialogContent>
    </Dialog>
  ) : (
    formContent
  )
}

export default BranchForm
