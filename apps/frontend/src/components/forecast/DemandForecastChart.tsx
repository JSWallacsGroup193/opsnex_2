import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { ForecastData } from "../../types"

interface DemandForecastChartProps {
  data: ForecastData[]
}

export function DemandForecastChart({ data }: DemandForecastChartProps) {
  return (
    <Card className="border-[#475569] bg-[#334155]">
      <CardHeader>
        <CardTitle className="text-slate-100">Demand Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
                color: "#f1f5f9",
              }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend
              wrapperStyle={{ color: "#f1f5f9" }}
              iconType="line"
              formatter={(value) => <span className="text-slate-100">{value}</span>}
            />
            <Line type="monotone" dataKey="historical" stroke="#14b8a6" strokeWidth={2} dot={false} name="Historical" />
            <Line
              type="monotone"
              dataKey="forecasted"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Forecasted"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
