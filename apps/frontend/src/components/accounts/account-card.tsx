import { useState } from 'react'
import type { TouchEvent } from 'react'
import type { Account } from '@/types/view-models/account'
import { Phone, Mail, Calendar, Trash2 } from 'lucide-react'

interface AccountCardProps {
  account: Account
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function AccountCard({ account, onView, onEdit: _onEdit, onDelete }: AccountCardProps) {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showDelete, setShowDelete] = useState(false)

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setShowDelete(true)
    }
    if (touchStart - touchEnd < -75) {
      setShowDelete(false)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-slate-600 bg-slate-700"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`transition-transform duration-200 ${showDelete ? '-translate-x-20' : 'translate-x-0'}`}>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-100">{account.name}</h3>
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  account.type === 'commercial' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-600 text-slate-300'
                }`}
              >
                {account.type}
              </span>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                account.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'
              }`}
            >
              {account.status}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Phone className="h-4 w-4" />
              <span>{account.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Mail className="h-4 w-4" />
              <span>{account.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>
                Last service: {account.lastServiceDate ? new Date(account.lastServiceDate).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onView(account.id)}
            className="mt-4 w-full rounded-lg border border-teal-500 py-2 text-sm font-medium text-teal-500 hover:bg-teal-500/10"
          >
            View Account
          </button>
        </div>
      </div>

      {/* Delete Button (Swipe Action) */}
      <button
        onClick={() => onDelete(account.id)}
        className="absolute right-0 top-0 flex h-full w-20 items-center justify-center bg-red-500 text-white"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}
