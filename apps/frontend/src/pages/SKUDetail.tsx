import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SKUDetailHeader } from '@/components/inventory/detail/sku-detail-header'
import { OverviewTab } from '@/components/inventory/detail/tabs/overview-tab'
import { StockLocationTab } from '@/components/inventory/detail/tabs/stock-location-tab'
import { StockLedgerTab } from '@/components/inventory/detail/tabs/stock-ledger-tab'
import { UsageForecastingTab } from '@/components/inventory/detail/tabs/usage-forecasting-tab'
import { SuppliersTab } from '@/components/inventory/detail/tabs/suppliers-tab'
import { PhotosDocumentsTab } from '@/components/inventory/detail/tabs/photos-documents-tab'
import { SKUSidebar } from '@/components/inventory/detail/sku-sidebar'
import type {
  SKUDetail,
  StockLocation,
  StockTransaction,
  Supplier,
  UsageData,
  ForecastData,
  RelatedSKU,
} from '@/types/view-models/inventory'

// Mock data
const mockSKU: SKUDetail = {
  id: '1',
  sku: 'HVAC-001',
  description: '20x25x4 MERV 13 Air Filter',
  category: 'Filters',
  onHand: 45,
  reorderPoint: 20,
  unitCost: 12.5,
  location: {
    warehouse: 'Main Warehouse',
    bin: 'A-12',
  },
  manufacturer: 'FilterPro',
  modelNumber: 'FP-2025-M13',
  upc: '123456789012',
  reorderQuantity: 50,
  safetyStock: 10,
  lastCounted: '2025-01-15',
  averageCost: 12.75,
  sellingPrice: 24.99,
  markup: 96,
  active: true,
  createdDate: '2024-06-15',
  lastUpdated: '2025-01-20',
}

const mockLocations: StockLocation[] = [
  { id: '1', warehouse: 'Main Warehouse', bin: 'A-12', quantity: 30, lastUpdated: '2025-01-20' },
  { id: '2', warehouse: 'North Branch', bin: 'B-05', quantity: 15, lastUpdated: '2025-01-18' },
]

const mockTransactions: StockTransaction[] = [
  {
    id: '1',
    date: '2025-01-20',
    type: 'purchase',
    quantity: 50,
    balance: 45,
    reason: 'Regular restock',
    user: 'John Smith',
  },
  {
    id: '2',
    date: '2025-01-18',
    type: 'sale',
    quantity: -5,
    balance: 40,
    reason: 'Work Order #1234',
    user: 'System',
  },
  {
    id: '3',
    date: '2025-01-15',
    type: 'adjustment',
    quantity: -2,
    balance: 45,
    reason: 'Inventory count correction',
    user: 'Jane Doe',
  },
]

const mockUsageData: UsageData[] = [
  { date: 'Nov', quantity: 15 },
  { date: 'Dec', quantity: 22 },
  { date: 'Jan', quantity: 18 },
]

const mockForecast: ForecastData = {
  avgMonthlyUsage: 18,
  daysUntilReorder: 45,
  suggestedOrderQuantity: 50,
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'FilterPro Direct',
    partNumber: 'FP-2025-M13',
    unitCost: 12.5,
    leadTime: '5-7 days',
    lastOrdered: '2025-01-20',
    isPrimary: true,
  },
  {
    id: '2',
    name: 'HVAC Supply Co',
    partNumber: 'HSC-F2025',
    unitCost: 13.25,
    leadTime: '3-5 days',
    lastOrdered: '2024-12-10',
    isPrimary: false,
  },
]

const mockRelatedItems: RelatedSKU[] = [
  { id: '1', sku: 'HVAC-002', description: '20x25x4 MERV 11 Air Filter', type: 'alternative' },
  { id: '2', sku: 'HVAC-010', description: 'Filter Gasket Kit', type: 'compatible' },
]

export default function SKUDetail() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-950">
      <SKUDetailHeader
        sku={mockSKU}
        onEdit={() => alert('Edit SKU - Will open edit modal')}
        onPrintLabel={() => alert('Print Label - Will print barcode label')}
        onAdjustStock={() => alert('Adjust Stock - Will open stock adjustment modal')}
      />

      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-500"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="locations"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-500"
                >
                  Stock by Location
                </TabsTrigger>
                <TabsTrigger
                  value="ledger"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-500"
                >
                  Stock Ledger
                </TabsTrigger>
                <TabsTrigger
                  value="usage"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-500"
                >
                  Usage & Forecasting
                </TabsTrigger>
                <TabsTrigger
                  value="suppliers"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-500"
                >
                  Suppliers
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-500"
                >
                  Photos & Documents
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="overview">
                  <OverviewTab sku={mockSKU} onEdit={() => alert('Edit Info - Will open edit modal')} />
                </TabsContent>

                <TabsContent value="locations">
                  <StockLocationTab
                    locations={mockLocations}
                    onTransfer={() => alert('Transfer Stock - Will open transfer modal')}
                    onAdjust={(locationId) => alert(`Adjust quantity for location ${locationId}`)}
                  />
                </TabsContent>

                <TabsContent value="ledger">
                  <StockLedgerTab transactions={mockTransactions} />
                </TabsContent>

                <TabsContent value="usage">
                  <UsageForecastingTab
                    usageData={mockUsageData}
                    forecast={mockForecast}
                    workOrderUsage={{
                      count: 24,
                      commonJobTypes: ['AC Maintenance', 'Filter Replacement', 'System Tune-up'],
                    }}
                  />
                </TabsContent>

                <TabsContent value="suppliers">
                  <SuppliersTab
                    suppliers={mockSuppliers}
                    onAddSupplier={() => alert('Add Supplier - Will open add supplier modal')}
                    onReorder={(supplierId) => alert(`Create PO from supplier ${supplierId}`)}
                  />
                </TabsContent>

                <TabsContent value="photos">
                  <PhotosDocumentsTab
                    photos={[
                      { id: '1', url: '', name: 'Product Image 1.jpg' },
                      { id: '2', url: '', name: 'Product Image 2.jpg' },
                    ]}
                    documents={[
                      {
                        id: '1',
                        name: 'Product Spec Sheet.pdf',
                        type: 'PDF',
                        size: '2.4 MB',
                        uploadedDate: '2024-12-01',
                      },
                      {
                        id: '2',
                        name: 'Installation Manual.pdf',
                        type: 'PDF',
                        size: '1.8 MB',
                        uploadedDate: '2024-12-01',
                      },
                    ]}
                    onUploadPhoto={() => alert('Upload Photo - Will open file picker')}
                    onUploadDocument={() => alert('Upload Document - Will open file picker')}
                    onDeletePhoto={(photoId) => {
                      if (confirm(`Delete photo ${photoId}?`)) alert('Photo deleted')
                    }}
                    onDeleteDocument={(docId) => {
                      if (confirm(`Delete document ${docId}?`)) alert('Document deleted')
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <SKUSidebar
              sku={mockSKU}
              relatedItems={mockRelatedItems}
              onCreatePO={() => alert('Create Purchase Order - Will open PO form')}
              onAdjustStock={() => alert('Adjust Stock - Will open adjustment modal')}
              onPrintLabel={() => alert('Print Barcode Label - Will print label')}
              onViewScanner={() => alert('View in Scanner - Will navigate to scanner')}
              onConfigureAlerts={() => alert('Configure Alerts - Will open alert settings')}
              onManageRelations={() => alert('Manage Relations - Will open relations manager')}
              onToggleActive={(active) => alert(`SKU ${active ? 'activated' : 'deactivated'}`)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
