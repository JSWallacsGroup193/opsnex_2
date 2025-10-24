import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface WorkOrderFormHeaderProps {
  isEditing: boolean
  workOrderNumber?: string
  currentStep?: number
  totalSteps?: number
}

export function WorkOrderFormHeader({ isEditing, workOrderNumber, currentStep, totalSteps }: WorkOrderFormHeaderProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link to="/work-orders" className="text-slate-400 hover:text-slate-100 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              {isEditing ? `Edit Work Order ${workOrderNumber}` : 'Create Work Order'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
              <Link to="/" className="hover:text-slate-100">
                Home
              </Link>
              <span>/</span>
              <Link to="/work-orders" className="hover:text-slate-100">
                Work Orders
              </Link>
              <span>/</span>
              <span className="text-slate-100">{isEditing ? 'Edit' : 'Create'}</span>
            </div>
          </div>
        </div>
      </div>

      {currentStep && totalSteps && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-slate-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
