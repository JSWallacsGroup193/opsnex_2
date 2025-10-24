import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { InventoryList } from '@/components/inventory/inventory-list'
import type { SKU, InventoryStats } from '@/types/view-models/inventory'
import api from '../utils/axiosClient'

export default function Inventory() {
  const navigate = useNavigate()
  const [skus, setSkus] = useState<SKU[]>([])
  const [stats, setStats] = useState<InventoryStats>({
    totalSKUs: 0,
    lowStockAlerts: 0,
    outOfStock: 0,
    totalInventoryValue: 0,
  })
  const [categories, setCategories] = useState<string[]>([])
  const [warehouses, setWarehouses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadInventory = async () => {
    try {
      setLoading(true)
      const [skusRes, warehousesRes] = await Promise.all([
        api.get('/inventory/skus'),
        api.get('/inventory/warehouses'),
      ])

      const skuData = Array.isArray(skusRes.data) ? skusRes.data : (skusRes.data.items || [])
      setSkus(skuData)

      const uniqueCategories = [...new Set(skuData.map((s: any) => s.category).filter(Boolean))]
      setCategories(uniqueCategories as string[])

      const warehouseNames = warehousesRes.data.map((w: any) => w.name)
      setWarehouses(warehouseNames)

      const lowStock = skuData.filter((s: any) => s.onHand > 0 && s.onHand <= s.reorderPoint).length
      const outOfStock = skuData.filter((s: any) => s.onHand === 0).length
      const totalValue = skuData.reduce((sum: number, s: any) => sum + (s.onHand * (s.unitCost || 0)), 0)

      setStats({
        totalSKUs: skuData.length,
        lowStockAlerts: lowStock,
        outOfStock: outOfStock,
        totalInventoryValue: totalValue,
      })
    } catch (error) {
      console.error('Error loading inventory:', error)
      toast.error('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const handleCreateSKU = () => {
    toast('Create SKU feature coming soon', { icon: 'ℹ️' })
  }

  const handleView = (id: string) => {
    navigate(`/inventory/${id}`)
  }

  const handleEdit = (_id: string) => {
    toast('Edit SKU feature coming soon', { icon: 'ℹ️' })
  }

  const handlePrintLabel = (id: string) => {
    navigate(`/labels?skuId=${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this SKU?')) {
      try {
        await api.delete(`/inventory/skus/${id}`)
        toast.success('SKU deleted successfully')
        loadInventory()
      } catch (error) {
        console.error('Error deleting SKU:', error)
        toast.error('Failed to delete SKU')
      }
    }
  }

  const handleScanBarcode = () => {
    navigate('/scanner')
  }

  const handleImportSKUs = () => {
    toast('Import SKUs feature coming soon', { icon: 'ℹ️' })
  }

  const handleExportCSV = () => {
    try {
      const csvContent = [
        ['SKU', 'Description', 'Category', 'On Hand', 'Unit Cost', 'Barcode'].join(','),
        ...skus.map((s) =>
          [s.sku, s.description, s.category, s.onHand, s.unitCost, s.barcode || ''].join(',')
        ),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('CSV exported successfully')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Failed to export CSV')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-teal-500">Loading inventory...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Inventory</h1>
        <p className="text-slate-400 text-sm sm:text-base">Control supply. Know every part. Zero loss.</p>
      </div>
      
      <InventoryList
        skus={skus}
        stats={stats}
        categories={categories}
        warehouses={warehouses}
        onCreateSKU={handleCreateSKU}
        onView={handleView}
        onEdit={handleEdit}
        onPrintLabel={handlePrintLabel}
        onDelete={handleDelete}
        onScanBarcode={handleScanBarcode}
        onImportSKUs={handleImportSKUs}
        onExportCSV={handleExportCSV}
      />
    </div>
  )
}
