'use client'

import { useFormStatus } from 'react-dom'
import { updateUser, addUser } from '@/app/(frontend)/dashboard/settings/actions'
import { useState } from 'react'
import { toggle } from '@/lib/crudActions'
import { useRouter } from 'next/navigation'
import { User } from '@/payload-types'

function SubmitButton({ isAddForm }: { isAddForm: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {pending ? (isAddForm ? 'Adding...' : 'Updating...') : isAddForm ? 'Add' : 'Update'}
    </button>
  )
}

interface ProfileFormProps {
  user?: User
  currentUser?: {
    id: number
    role?: string
  }
  branchId?: string | number
  isAddForm?: boolean
  onCancel?: () => void
  onSuccess?: () => void
}

export default function ProfileForm({
  user,
  currentUser,
  branchId,
  isAddForm = false,
  onSuccess,
}: ProfileFormProps) {
  const router = useRouter()
  const isAdmin = currentUser?.role === 'admin'
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleAddUser(formData: FormData) {
    setError(null)
    try {
      await addUser(formData)
      setSuccess(true)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setError('Failed to add member. Please try again.')
    }
  }

  async function handleUpdateUser(formData: FormData) {
    setError(null)
    try {
      await updateUser(formData)
      setSuccess(true)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setError('Failed to update user. Please try again.')
    }
  }

  async function toggleUserStatus() {
    if (!user) return

    try {
      toggle('users', user.id, !user.isActive)
      router.refresh()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setError('Failed to toggle user status.')
    }
  }

  return (
    <div className={isAddForm ? 'w-full' : 'max-w-2xl'}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {isAddForm ? 'Member added successfully!' : 'Member updated successfully!'}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form
          action={isAddForm ? handleAddUser : handleUpdateUser}
          className={isAddForm ? 'flex flex-col gap-4' : 'flex flex-col gap-4'}
        >
          {!isAddForm && user && <input type="hidden" name="userId" value={user.id} />}
          {isAddForm && branchId && <input type="hidden" name="branchId" value={branchId} />}

          {isAddForm ? (
            // Single column layout for add form
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-500 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="name"
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-1">
                  Phone number (without country code)
                </label>
                <input
                  type="number"
                  id="phone"
                  name="phoneNumber"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-500 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  defaultValue="chef"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isAdmin && <option value="admin">Admin</option>}
                  <option value="manager">Manager</option>
                  <option value="chef">Chef</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <SubmitButton isAddForm={true} />
              </div>
            </>
          ) : (
            // Single column layout for edit form
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-500 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="name"
                  defaultValue={user?.name || ''}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user?.email || ''}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-1">
                  Phone number
                </label>
                <input
                  type="number"
                  id="phone"
                  name="phoneNumber"
                  defaultValue={user?.phoneNumber || ''}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-500 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  defaultValue={user?.role || ''}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div
                className={`flex items-center ${!currentUser || user?.id !== currentUser.id ? 'justify-between' : 'justify-end'} mt-2`}
              >
                {(!currentUser || user?.id !== currentUser.id) && (
                  <button
                    type="button"
                    onClick={toggleUserStatus}
                    className={`px-4 py-2 rounded focus:outline-none focus:ring-2 ${
                      user?.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
                    }`}
                  >
                    {user?.isActive ? 'Deactivate Member' : 'Activate Member'}
                  </button>
                )}
                <SubmitButton isAddForm={isAddForm} />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
