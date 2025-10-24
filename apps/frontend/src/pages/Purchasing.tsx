
import { useEffect, useState } from 'react'
import { Package, CheckCircle } from 'lucide-react'
import api from '../utils/axiosClient'

export default function Purchasing() {
  const [items, setItems] = useState<any[]>([])
  
  async function load() {
    const { data } = await api.get('/purchasing')
    setItems(data.items || [])
  }
  
  useEffect(() => { load() }, [])

  async function receive(poId: string) {
    await api.put(`/purchasing/${poId}/receive`)
    await load()
  }

  const getStatusBadge = (status: string) => {
    const classes = status === 'RECEIVED' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    return <span className={`px-2 py-1 text-xs rounded-full border ${classes}`}>{status}</span>
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 md:px-6 py-4 md:py-6 mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Purchasing</h1>
        <p className="text-slate-400 text-sm sm:text-base">Requisition gear. Keep supply lines moving.</p>
      </div>
      
      <div className="p-3 md:p-6 pt-0">
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-800 rounded-lg overflow-x-auto border border-slate-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-700 text-left">
              <th className="p-3 border-b border-slate-600 text-gray-300">PO Number</th>
              <th className="p-3 border-b border-slate-600 text-gray-300">Status</th>
              <th className="p-3 border-b border-slate-600 text-gray-300">Items</th>
              <th className="p-3 border-b border-slate-600 text-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any) => (
              <tr key={it.id} className="hover:bg-slate-700/50">
                <td className="p-3 border-b border-slate-700 text-white font-mono">{it.poNumber || it.id.slice(0, 8)}</td>
                <td className="p-3 border-b border-slate-700">{getStatusBadge(it.status)}</td>
                <td className="p-3 border-b border-slate-700 text-gray-300">{it.sku?.sku || it.sku?.name || '-'} × {it.quantity}</td>
                <td className="p-3 border-b border-slate-700">
                  {it.status !== 'RECEIVED' && (
                    <button 
                      onClick={() => receive(it.id)} 
                      className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm transition-colors border-none min-h-[44px] md:min-h-0"
                    >
                      Mark Received
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {items.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <Package className="w-12 h-12 text-teal-500 mx-auto mb-3" />
            <p className="text-slate-400">No purchase orders found</p>
          </div>
        ) : (
          items.map((it: any) => (
            <div key={it.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-teal-500" />
                    <span className="font-mono text-sm text-white">{it.poNumber || it.id.slice(0, 8)}</span>
                  </div>
                  <p className="text-sm text-gray-300">{it.sku?.sku || it.sku?.name || '-'} × {it.quantity}</p>
                </div>
                {getStatusBadge(it.status)}
              </div>
              
              {it.status !== 'RECEIVED' && (
                <button 
                  onClick={() => receive(it.id)} 
                  className="w-full px-4 py-3 rounded-md bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium transition-colors border-none min-h-[48px] flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Received
                </button>
              )}
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  )
}
