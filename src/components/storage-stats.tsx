import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatBytes, STORAGE_LIMIT } from "@/lib/utils"
import { HardDrive } from "lucide-react"

interface StorageStatsProps {
  usedStorage: number
}

export function StorageStats({ usedStorage }: StorageStatsProps) {
  const usedPercentage = (usedStorage / STORAGE_LIMIT) * 100
  const remainingStorage = STORAGE_LIMIT - usedStorage

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
        <HardDrive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {formatBytes(usedStorage)}
            </span>
            <span className="text-sm text-muted-foreground">
              of {formatBytes(STORAGE_LIMIT)}
            </span>
          </div>
          <Progress value={usedPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatBytes(remainingStorage)} remaining</span>
            <span>{usedPercentage.toFixed(1)}% used</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
