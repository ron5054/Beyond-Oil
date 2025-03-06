"use client"

import { ChevronLeft, ChevronRight, Share2, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const tmpData = [
  { month: "Jan", fryer1: 20, fryer2: 40 },
  { month: "Feb", fryer1: 25, fryer2: 60 },
  { month: "Mar", fryer1: 35, fryer2: 55 },
  { month: "Apr", fryer1: 45, fryer2: 50 },
  { month: "May", fryer1: 55, fryer2: 45 },
  { month: "Jun", fryer1: 65, fryer2: 40 },
  { month: "Jul", fryer1: 75, fryer2: 35 },
  { month: "Aug", fryer1: 80, fryer2: 30 },
  { month: "Sep", fryer1: 70, fryer2: 25 },
]

const fryers = [
  {
    id: 2,
    name: "Fryer 2",
    description: "Happy Penny 25L - French Fries",
    status: "Not Measured",
    statusType: "warning",
  },
  {
    id: 3,
    name: "Fryer 3",
    description: "Winston 45L - Chicken",
    status: "2.5 TMP",
    statusType: "success",
  },
  {
    id: 4,
    name: "Fryer 3",
    description: "Winston 45L - Chicken",
    status: "1.6 TMP",
    statusType: "success",
  },
]

const dailyImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=400",
    timestamp: "12 Aug 2023 10:00 PM",
    user: "John Doe",
    title: "[Fryer Name / Food Sample]",
    subtitle: "[Image Name]",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=400",
    timestamp: "12 Aug 2023 10:00 PM",
    user: "John Doe",
    title: "[Fryer Name / Food Sample]",
    subtitle: "[Image Name]",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=300&width=400",
    timestamp: "12 Aug 2023 10:00 PM",
    user: "John Doe",
    title: "[Fryer Name / Food Sample]",
    subtitle: "[Image Name]",
  },
]

export function FryersPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-semibold text-[#212b36]">Hi, Hudson 👋</h1>
          <Select defaultValue="tel-aviv">
            <SelectTrigger className="w-[120px] h-8 text-sm border-0 bg-transparent">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tel-aviv">Tel Aviv</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-[#637381]">6/45 Days Of Pilot</p>
      </div>

      {/* Fryers Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#212b36]">Fryers</h2>
          <Select defaultValue="today">
            <SelectTrigger className="w-[100px] h-8 text-sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {fryers.map((fryer) => (
            <Card key={fryer.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4f6f8] rounded-lg flex items-center justify-center">
                  <Image src="/placeholder.svg?height=32&width=32" alt={fryer.name} width={32} height={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{fryer.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={fryer.statusType as "warning" | "success"}
                        className={
                          fryer.statusType === "warning"
                            ? "bg-[#fff7cd] text-[#7a4f01] hover:bg-[#fff7cd]"
                            : "bg-[#e8f5f3] text-[#1a3f36] hover:bg-[#e8f5f3]"
                        }
                      >
                        {fryer.status}
                      </Badge>
                      {fryer.statusType === "success" && <Check className="w-4 h-4 text-[#1a3f36]" />}
                    </div>
                  </div>
                  <p className="text-sm text-[#637381]">{fryer.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Images Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#212b36]">Daily Images</h2>
            <p className="text-sm text-[#ff4842]">Missing 3/6 Food Samples</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {dailyImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative bg-[#f4f6f8]">
                <Image src={image.src || "/placeholder.svg"} alt="Food sample" fill className="object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2 text-sm text-[#637381]">
                  <div className="flex items-center gap-2">
                    <span>{image.timestamp}</span>
                    <span>•</span>
                    <span>{image.user}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-medium">{image.title}</p>
                <p className="text-sm text-[#637381]">{image.subtitle}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* TMP Levels Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#212b36]">TMP Levels</h2>
          <Select defaultValue="all-time">
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-4">
          <div className="w-full overflow-x-auto">
            <LineChart width={800} height={300} data={tmpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f6f8" />
              <XAxis dataKey="month" stroke="#637381" tick={{ fill: "#637381" }} />
              <YAxis stroke="#637381" tick={{ fill: "#637381" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="fryer1" stroke="#00a76f" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fryer2" stroke="#ffab00" strokeWidth={2} dot={false} />
            </LineChart>
          </div>
        </Card>
      </div>
    </div>
  )
}

