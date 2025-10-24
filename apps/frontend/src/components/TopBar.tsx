import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { LogOut, Menu, Sun, Moon } from 'lucide-react'
import { Notifications } from './Notifications'
import { useThemeStore } from '../store/useThemeStore'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate()
  const logout = useAuth(s => s.logout)
  const { theme, toggleTheme } = useThemeStore()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <div className="flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Only on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors p-2 -ml-2"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="h-8 w-8 bg-teal-500 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">ON</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">OpsNex</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">HVAC Operations</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <Notifications />
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  )
}
