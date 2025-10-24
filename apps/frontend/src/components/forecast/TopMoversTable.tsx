import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { TopMover } from "../../types"

interface TopMoversTableProps {
  movers: TopMover[]
}

export function TopMoversTable({ movers }: TopMoversTableProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-[#14b8a6]" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Minus className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <Card className="border-[#475569] bg-[#334155]">
      <CardHeader>
        <CardTitle className="text-slate-100">Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#475569] hover:bg-[#1e293b]">
                <TableHead className="text-slate-300">SKU</TableHead>
                <TableHead className="text-slate-300">Description</TableHead>
                <TableHead className="text-right text-slate-300">Avg Demand</TableHead>
                <TableHead className="text-center text-slate-300">Trend</TableHead>
                <TableHead className="text-right text-slate-300">Forecast</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movers.map((mover) => (
                <TableRow key={mover.sku} className="border-[#475569] hover:bg-[#1e293b]">
                  <TableCell className="font-medium text-slate-100">{mover.sku}</TableCell>
                  <TableCell className="text-slate-300">{mover.description}</TableCell>
                  <TableCell className="text-right text-slate-300">{mover.avgDemand}</TableCell>
                  <TableCell className="flex justify-center">{getTrendIcon(mover.trend)}</TableCell>
                  <TableCell className="text-right text-slate-300">{mover.forecast}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
