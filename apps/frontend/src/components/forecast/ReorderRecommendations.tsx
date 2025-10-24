import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { AlertCircle } from "lucide-react"
import type { ReorderRecommendation } from "../../types"

interface ReorderRecommendationsProps {
  recommendations: ReorderRecommendation[]
  onCreatePO: (sku: string) => void
}

export function ReorderRecommendations({ recommendations, onCreatePO }: ReorderRecommendationsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
    }
  }

  return (
    <Card className="border-[#475569] bg-[#334155]">
      <CardHeader>
        <CardTitle className="text-slate-100">Reorder Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.sku} className="space-y-2 rounded-lg border border-[#475569] bg-[#1e293b] p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-100">{rec.sku}</p>
                  <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">{rec.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <AlertCircle className="h-3 w-3" />
              <span>
                Stock: {rec.currentStock} / Reorder: {rec.reorderPoint}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Suggested: {rec.suggestedQuantity} units</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCreatePO(rec.sku)}
                className="border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6] hover:text-[#0f172a]"
              >
                Create PO
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
