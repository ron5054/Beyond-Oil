"use client"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BranchSettingsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#212b36]">Settings</h1>
        <Button>Update</Button>
      </div>

      <Tabs defaultValue="branch" className="space-y-6">
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#00a76f] rounded-none px-8 pb-4"
          >
            My Profile
          </TabsTrigger>
          <TabsTrigger
            value="branch"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#00a76f] rounded-none px-8 pb-4"
          >
            Branch
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#00a76f] rounded-none px-8 pb-4"
          >
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branch" className="space-y-6 m-0">
          {/* Details Section */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Branch name</Label>
                <Input placeholder="Enter branch name" />
              </div>
              <div className="space-y-1.5">
                <Label>Branch Code</Label>
                <Input placeholder="Enter branch code" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone number</Label>
                <Input placeholder="Enter phone number" />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input placeholder="Enter address" />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input placeholder="Enter city" />
              </div>
              <div className="space-y-1.5">
                <Label>State</Label>
                <Input placeholder="Enter state" />
              </div>
              <div className="space-y-1.5">
                <Label>Zip Code</Label>
                <Input placeholder="Enter zip code" />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Select>
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
          </Card>

          {/* Daily Filter Time */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Daily Filter Time</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Time zone</Label>
                <Select defaultValue="jerusalem">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jerusalem">Jerusalem (GMT-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Daily Filter Hour</Label>
                <Select defaultValue="8">
                  <SelectTrigger>
                    <SelectValue placeholder="Select hour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8:00</SelectItem>
                    <SelectItem value="9">9:00</SelectItem>
                    <SelectItem value="10">10:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Fryers */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Fryers</h2>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Name: Fryer 1</div>
                  <div className="text-sm text-[#637381]">Type: Winston 55 L</div>
                  <div className="text-sm text-[#637381]">Items Fried: Chicken</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-start justify-between p-4 border rounded-lg bg-[#f4f6f8]">
                <div className="space-y-1">
                  <div className="font-medium">Name: Fryer 2</div>
                  <div className="text-sm text-[#637381]">Type: Winston 25 L</div>
                  <div className="text-sm text-[#637381]">Sub Fryer</div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Food Samples Pics */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Food Samples Pics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Chicken</Label>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>Oil end of the day</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

