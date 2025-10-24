import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { ChevronDown, ChevronUp, Wrench, AlertCircle, Settings, ClipboardCheck, Zap } from 'lucide-react'
import type { WorkOrderFormData } from '@/lib/validations/work-order-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface JobDetailsSectionProps {
  form: UseFormReturn<WorkOrderFormData>
}

const jobTypes = [
  { value: 'installation', label: 'Installation', icon: Settings },
  { value: 'repair', label: 'Repair', icon: Wrench },
  { value: 'maintenance', label: 'Maintenance', icon: ClipboardCheck },
  { value: 'inspection', label: 'Inspection', icon: AlertCircle },
  { value: 'emergency', label: 'Emergency', icon: Zap },
]

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-slate-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Emergency', color: 'bg-red-500' },
]

export function JobDetailsSection({ form }: JobDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const selectedJobType = form.watch('jobType')
  const selectedPriority = form.watch('priority')
  const description = form.watch('description')

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-600/50 transition-colors rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-slate-100">
          Job Details <span className="text-red-400">*</span>
        </h2>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-600">
          {/* Job Type */}
          <div className="space-y-2">
            <Label className="text-slate-100">
              Job Type <span className="text-red-400">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {jobTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => form.setValue('jobType', type.value as any)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                      selectedJobType === type.value
                        ? 'bg-teal-500/20 border-teal-500 text-teal-500'
                        : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                )
              })}
            </div>
            {form.formState.errors.jobType && (
              <p className="text-sm text-red-400">{form.formState.errors.jobType.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-slate-100">
              Priority <span className="text-red-400">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => form.setValue('priority', priority.value as any)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    selectedPriority === priority.value
                      ? 'bg-teal-500/20 border-teal-500'
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                  <span
                    className={`text-sm font-medium ${
                      selectedPriority === priority.value ? 'text-teal-500' : 'text-slate-300'
                    }`}
                  >
                    {priority.label}
                  </span>
                </button>
              ))}
            </div>
            {form.formState.errors.priority && <p className="text-sm text-red-400">{form.formState.errors.priority.message}</p>}
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-100">
              Problem Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe the issue or work to be performed..."
              className="min-h-[150px] bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 resize-none"
            />
            <div className="flex items-center justify-between text-sm">
              {form.formState.errors.description && <p className="text-red-400">{form.formState.errors.description.message}</p>}
              <p className="text-slate-400 ml-auto">{description?.length || 0} characters</p>
            </div>
          </div>

          {/* Customer Notes */}
          <div className="space-y-2">
            <Label htmlFor="customerNotes" className="text-slate-100">
              Customer Notes
            </Label>
            <Textarea
              id="customerNotes"
              {...form.register('customerNotes')}
              placeholder="Additional notes from customer..."
              className="min-h-[100px] bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
