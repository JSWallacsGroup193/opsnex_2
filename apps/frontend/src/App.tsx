import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuthStore } from './store/useAuthStore'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { useThemeStore } from './store/useThemeStore'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const WorkOrders = lazy(() => import('./pages/WorkOrders'))
const WorkOrderDetail = lazy(() => import('./pages/WorkOrderDetail'))
const CreateWorkOrder = lazy(() => import('./pages/CreateWorkOrder'))
const Accounts = lazy(() => import('./pages/Accounts'))
const AccountDetail = lazy(() => import('./pages/AccountDetail'))
const Contacts = lazy(() => import('./pages/Contacts'))
const Leads = lazy(() => import('./pages/Leads'))
const CRM = lazy(() => import('./pages/CRM'))
const Inventory = lazy(() => import('./pages/Inventory'))
const SKUDetail = lazy(() => import('./pages/SKUDetail'))
const Purchasing = lazy(() => import('./pages/Purchasing'))
const Vendors = lazy(() => import('./pages/Vendors'))
const VendorDetail = lazy(() => import('./pages/VendorDetail'))
const Dispatch = lazy(() => import('./pages/Dispatch'))
const Labels = lazy(() => import('./pages/Labels'))
const Forecast = lazy(() => import('./pages/Forecast'))
const Scanner = lazy(() => import('./pages/Scanner'))
const AI = lazy(() => import('./pages/AI'))
const FieldToolsPage = lazy(() => import('./pages/FieldTools/FieldToolsPage'))
const ProposalBuilder = lazy(() => import('./pages/FieldTools/components/ProposalBuilder'))
const EstimatesList = lazy(() => import('./pages/FieldTools/components/EstimatesList'))
const ServiceCatalogPage = lazy(() => import('./pages/ServiceCatalog/ServiceCatalogPage').then(m => ({ default: m.ServiceCatalogPage })))
const SettingsPage = lazy(() => import('./pages/Settings'))
const FeedbackPage = lazy(() => import('./pages/Feedback'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminRoles = lazy(() => import('./pages/admin/Roles'))
const AdminTenants = lazy(() => import('./pages/admin/Tenants'))

export default function App() {
  const token = useAuthStore(s => s.token)
  const user = useAuthStore(s => s.user)
  const loadUser = useAuthStore(s => s.loadUser)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = useThemeStore(s => s.theme)

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Load user profile on mount if token exists
  useEffect(() => {
    if (token) {
      loadUser()
    }
  }, [])

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="grid grid-rows-[56px_1fr] h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <div className="relative flex lg:grid lg:grid-cols-[240px_1fr] overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 p-4 overflow-auto bg-slate-100 dark:bg-slate-900">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/work-orders" element={<WorkOrders />} />
              <Route path="/work-orders/create" element={<CreateWorkOrder />} />
              <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/accounts/:id" element={<AccountDetail />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:id" element={<SKUDetail />} />
              <Route path="/purchasing" element={<Purchasing />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendors/:id" element={<VendorDetail />} />
              <Route path="/dispatch" element={<Dispatch />} />
              <Route path="/labels" element={<Labels />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/field-tools" element={<FieldToolsPage />} />
              <Route path="/estimates" element={<EstimatesList />} />
              <Route path="/proposals" element={<ProposalBuilder />} />
              <Route path="/service-catalog" element={<ServiceCatalogPage />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/settings" element={<SettingsPage user={user as any} />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="roles" element={<AdminRoles />} />
                <Route path="tenants" element={<AdminTenants />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
