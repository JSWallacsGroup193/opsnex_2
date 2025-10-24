import { Link, useLocation } from 'react-router-dom'
import { memo } from 'react'
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Package, 
  ShoppingCart, 
  Calendar, 
  Tag, 
  TrendingUp, 
  Scan, 
  Wrench, 
  Bot,
  Shield,
  Settings,
  X,
  BookOpen,
  MessageSquare,
  Building2
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import logo from '@/assets/logo.png'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/work-orders', label: 'Work Orders', icon: ClipboardList },
  { to: '/accounts', label: 'CRM', icon: Users },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/service-catalog', label: 'Service Catalog', icon: BookOpen },
  { to: '/purchasing', label: 'Purchasing', icon: ShoppingCart },
  { to: '/vendors', label: 'Vendors', icon: Building2 },
  { to: '/dispatch', label: 'Dispatch & Scheduling', icon: Calendar },
  { to: '/labels', label: 'Labels', icon: Tag },
  { to: '/forecast', label: 'Forecasting', icon: TrendingUp },
  { to: '/scanner', label: 'Barcode Scanner', icon: Scan },
  { to: '/field-tools', label: 'Field Tools', icon: Wrench },
  { to: '/ai', label: 'AI Assistant', icon: Bot },
  { to: '/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const Item = memo(({ to, label, icon: Icon, onClick }: { to: string; label: string; icon: any; onClick?: () => void }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
        active 
          ? 'bg-slate-200 dark:bg-slate-800 text-teal-500 dark:text-teal-400 border-l-2 border-teal-500 pl-2.5' 
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
})

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useAuthStore()
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          w-60 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={logo} alt="OpsNex Logo" className="h-16 w-auto object-contain" style={{ mixBlendMode: 'lighten' }} />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="flex flex-col gap-1 p-3 overflow-y-auto flex-1">
          {navItems.map(item => (
            <Item 
              key={item.to} 
              to={item.to} 
              label={item.label} 
              icon={item.icon} 
              onClick={onClose}
            />
          ))}
          
          {user?.isSuperAdmin && (
            <>
              <div className="border-t border-slate-300 dark:border-slate-800 my-2" />
              <Item 
                to="/admin" 
                label="Super Admin" 
                icon={Shield} 
                onClick={onClose}
              />
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
