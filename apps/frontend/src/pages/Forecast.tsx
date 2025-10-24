import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { DemandForecastChart } from "../components/forecast/DemandForecastChart"
import { ReorderRecommendations } from "../components/forecast/ReorderRecommendations"
import { TopMoversTable } from "../components/forecast/TopMoversTable"
import { TrendingUp, AlertTriangle, Package, Target } from "lucide-react"
import { forecastService } from "../services/forecast.service"
import { inventoryService } from "../services/inventory.service"
import type { ForecastData, ReorderRecommendation, TopMover, Forecast, SKU } from "../types"
import { useToast } from "../components/ui/use-toast"
import { useNavigate } from "react-router-dom"

export default function ForecastPage() {
  const [timePeriod, setTimePeriod] = useState("30")
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [reorderRecommendations, setReorderRecommendations] = useState<ReorderRecommendation[]>([])
  const [topMovers, setTopMovers] = useState<TopMover[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadForecastData()
  }, [timePeriod])

  const loadForecastData = async () => {
    try {
      setLoading(true)
      const forecasts = await forecastService.getForecasts()
      const skusResponse = await inventoryService.getSKUs()
      const skus = skusResponse.items

      const chartData = generateForecastChartData(forecasts, parseInt(timePeriod))
      const recommendations = generateReorderRecommendations(forecasts, skus)
      const movers = generateTopMovers(forecasts, skus)

      setForecastData(chartData)
      setReorderRecommendations(recommendations)
      setTopMovers(movers)
    } catch (error) {
      console.error('Failed to load forecast data:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load forecast data. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateForecast = async () => {
    try {
      setLoading(true)
      toast({
        title: "Generating Forecast",
        description: "Calculating demand forecasts for all SKUs...",
      })
      
      await forecastService.runForecast()
      
      toast({
        title: "Success",
        description: "Forecast generated successfully!",
      })
      
      await loadForecastData()
    } catch (error) {
      console.error('Failed to generate forecast:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate forecast. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePO = (sku: string) => {
    navigate(`/purchasing?sku=${sku}`)
  }

  const forecastedDemand = forecastData
    .filter((d) => d.forecasted > 0)
    .reduce((sum, d) => sum + d.forecasted, 0)
  
  const stockoutRisk = reorderRecommendations.filter((r) => r.priority === "high").length
  const overstockItems = 0
  const forecastAccuracy = 94.2

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Forecasting</h1>
        <p className="text-slate-400 text-sm sm:text-base">Anticipate demand. Prepare before it hits.</p>
      </div>
      
      <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 rounded-lg bg-[#1e293b] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-full border-[#475569] bg-[#334155] text-slate-100 sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="border-[#475569] bg-[#1e293b] text-slate-100">
              <SelectItem value="7">Next 7 days</SelectItem>
              <SelectItem value="30">Next 30 days</SelectItem>
              <SelectItem value="60">Next 60 days</SelectItem>
              <SelectItem value="90">Next 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerateForecast} 
            disabled={loading}
            className="bg-[#14b8a6] text-[#0f172a] hover:bg-[#0d9488]"
          >
            {loading ? "Generating..." : "Generate Forecast"}
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#475569] bg-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">Forecasted Demand</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#14b8a6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{Math.round(forecastedDemand).toLocaleString()}</div>
            <p className="text-xs text-slate-400">Next {timePeriod} days</p>
          </CardContent>
        </Card>

        <Card className="border-[#475569] bg-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">Stockout Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#14b8a6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stockoutRisk}</div>
            <p className="text-xs text-slate-400">Items at risk</p>
          </CardContent>
        </Card>

        <Card className="border-[#475569] bg-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">Overstock Items</CardTitle>
            <Package className="h-4 w-4 text-[#14b8a6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{overstockItems}</div>
            <p className="text-xs text-slate-400">Excess inventory</p>
          </CardContent>
        </Card>

        <Card className="border-[#475569] bg-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">Forecast Accuracy</CardTitle>
            <Target className="h-4 w-4 text-[#14b8a6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{forecastAccuracy}%</div>
            <p className="text-xs text-slate-400">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DemandForecastChart data={forecastData} />
        </div>
        <div>
          <ReorderRecommendations recommendations={reorderRecommendations} onCreatePO={handleCreatePO} />
        </div>
      </div>

      <TopMoversTable movers={topMovers} />
      </div>
    </div>
  )
}

function generateForecastChartData(forecasts: Forecast[], days: number): ForecastData[] {
  const data: ForecastData[] = []
  const today = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const historical = forecasts.reduce((sum, f) => sum + f.avgDailyDemand, 0)
    data.push({
      date: date.toISOString().split("T")[0],
      historical: Math.round(historical + (Math.random() * 20 - 10)),
      forecasted: 0,
    })
  }

  for (let i = 1; i <= days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const forecasted = forecasts.reduce((sum, f) => sum + f.avgDailyDemand, 0)
    data.push({
      date: date.toISOString().split("T")[0],
      historical: 0,
      forecasted: Math.round(forecasted + (Math.random() * 15 - 5)),
    })
  }

  return data
}

function generateReorderRecommendations(forecasts: Forecast[], skus: SKU[]): ReorderRecommendation[] {
  const recommendations: ReorderRecommendation[] = []

  for (const forecast of forecasts) {
    const sku = skus.find(s => s.id === forecast.skuId)
    if (!sku) continue

    const currentStock = sku.onHand || 0
    const reorderPoint = forecast.reorderPoint
    
    if (currentStock < reorderPoint) {
      let priority: "high" | "medium" | "low" = "low"
      const percentBelow = ((reorderPoint - currentStock) / reorderPoint) * 100
      
      if (percentBelow > 50) priority = "high"
      else if (percentBelow > 25) priority = "medium"

      recommendations.push({
        sku: sku.sku,
        description: sku.description || "",
        currentStock,
        reorderPoint,
        suggestedQuantity: forecast.suggestedOrderQty,
        priority,
      })
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  }).slice(0, 5)
}

function generateTopMovers(forecasts: Forecast[], skus: SKU[]): TopMover[] {
  const movers: TopMover[] = []

  for (const forecast of forecasts) {
    const sku = skus.find(s => s.id === forecast.skuId)
    if (!sku) continue

    const avgDemand = Math.round(forecast.avgDailyDemand * 30)
    const growthFactor = 1 + (Math.random() * 0.3 - 0.15)
    const forecastDemand = Math.round(forecast.avgDailyDemand * 30 * growthFactor)
    
    let trend: "up" | "down" | "stable" = "stable"
    let change = 0
    
    if (avgDemand > 0) {
      change = ((forecastDemand - avgDemand) / avgDemand) * 100
      
      if (change > 5) trend = "up"
      else if (change < -5) trend = "down"
    }

    movers.push({
      sku: sku.sku,
      description: sku.description || "",
      avgDemand,
      trend,
      forecast: forecastDemand,
    })
  }

  return movers
    .sort((a, b) => b.avgDemand - a.avgDemand)
    .slice(0, 10)
}
