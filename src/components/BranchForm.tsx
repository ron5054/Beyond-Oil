'use client'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { addBranch } from '@/lib/branchActions'
import { update } from '@/lib/crudActions'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Branch, User } from '@/payload-types'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { branchSchema } from 'schemas'
import { ZodError } from 'zod'

interface BranchFormProps {
  isAddForm: boolean
  branch?: Branch | null
  users?: User[]
}

const BranchForm: React.FC<BranchFormProps> = ({ isAddForm, branch, users = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

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
      chainName: branch?.chainName as Branch['chainName'],
      logo: branch?.logo || null,
      filterTime: branch?.filterTime || '12:00',
      manager: branch?.manager || null,
      timezone: branch?.timezone || 'Jerusalem (GMT+2)',
    },
    validators: {
      onSubmit: branchSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        if (isAddForm) {
          addBranch('branches', value)
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

  const formContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="grid grid-cols-2 gap-2">
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
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                    {branchSchema.shape.country.options.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country === 'il' ? 'Israel' : 'United States'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
          <form.Field name="chainName">
            {(field) => (
              <>
                <Label htmlFor={field.name} className="text-gray-500">
                  Chain
                </Label>
                <Select
                  value={field.state.value || ''}
                  onValueChange={(val: Branch['chainName']) => field.handleChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchSchema.shape.chainName.options.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
          <form.Field name="logo">
            {(field) => (
              <>
                <Label htmlFor={field.name} className="text-gray-500">
                  Logo
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter logo URL/path"
                />
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                    onValueChange={(val) => field.handleChange(val === 'none' ? null : Number(val))}
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
                  {field.state.meta.errors && field.state.meta.errors[0] && (
                    <div className="text-xs text-red-500">
                      {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                    </div>
                  )}
                </>
              )
            }}
          </form.Field>
        </div>
      </div>

      <hr className="my-2 border-gray-200" />

      <h3 className="text-md font-medium">Daily filter time</h3>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
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
                    {branchSchema.shape.timezone.options.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
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
                    {branchSchema.shape.filterTime.options.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors && field.state.meta.errors[0] && (
                  <div className="text-xs text-red-500">
                    {(field.state.meta.errors[0] as ZodError['errors'][0]).message}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        {isAddForm ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-1 bg-blue-500 text-white rounded cursor-pointer"
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
      <DialogContent>{formContent}</DialogContent>
    </Dialog>
  ) : (
    formContent
  )
}

export default BranchForm
