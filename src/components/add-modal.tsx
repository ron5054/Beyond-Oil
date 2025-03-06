"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/utils/supabase"
import { toast } from "@/components/ui/use-toast"

interface AddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBranchAdded: () => void
}

export default function AddModal({ open, onOpenChange, onBranchAdded }: AddModalProps) {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!name || !company) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("branches")
        .insert([
          {
            name,
            company,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Success",
        description: "Branch added successfully",
      })
      onBranchAdded()
      onOpenChange(false)
      setName("")
      setCompany("")
    } catch (error) {
      console.error("Error adding branch:", error)
      toast({
        title: "Error",
        description: "Failed to add branch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-6 gap-5">
        <DialogHeader className="p-0">
          <DialogTitle className="text-[#212b36] font-medium text-base">Add New Branch</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label htmlFor="branch-name" className="text-[#637381] text-sm mb-1.5 block">
              Name
            </label>
            <Input
              id="branch-name"
              placeholder="Branch Name"
              className="border-[#dfe3e8] focus-visible:ring-[#00a76f]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="branch-company" className="text-[#637381] text-sm mb-1.5 block">
              Company
            </label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger id="branch-company" className="border-[#dfe3e8] focus:ring-[#00a76f]">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="McDonald's">McDonald's</SelectItem>
                <SelectItem value="KFC">KFC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[#212b36] hover:bg-[#919eab]/10">
            Cancel
          </Button>
          <Button className="bg-[#00a76f] hover:bg-[#00a76f]/90 px-3" onClick={handleAdd} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

