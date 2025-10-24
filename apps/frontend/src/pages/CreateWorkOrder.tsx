import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import api from '../utils/axiosClient'
import { WorkOrderFormHeader } from '@/components/work-orders/form/work-order-form-header'
import { CustomerSection } from '@/components/work-orders/form/customer-section'
import { JobDetailsSection } from '@/components/work-orders/form/job-details-section'
import { SchedulingSection } from '@/components/work-orders/form/scheduling-section'
import { PartsSection } from '@/components/work-orders/form/parts-section'
import { AdditionalSection } from '@/components/work-orders/form/additional-section'
import { workOrderFormSchema, type WorkOrderFormData } from '@/lib/validations/work-order-form'
import { Button } from '@/components/ui/button'

// Mock data
const mockCustomers = [
  {
    id: '1',
    name: 'John Smith',
    accountNumber: 'ACC-001',
    phone: '(555) 123-4567',
    email: 'john@example.com',
    address: '123 Main St, Springfield, IL 62701',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    accountNumber: 'ACC-002',
    phone: '(555) 234-5678',
    email: 'sarah@example.com',
    address: '456 Oak Ave, Springfield, IL 62702',
  },
  {
    id: '3',
    name: 'Mike Williams',
    accountNumber: 'ACC-003',
    phone: '(555) 345-6789',
    email: 'mike@example.com',
    address: '789 Pine Rd, Springfield, IL 62703',
  },
]

const mockTechnicians = [
  { id: '1', name: 'Tom Anderson', phone: '(555) 111-2222' },
  { id: '2', name: 'Lisa Chen', phone: '(555) 222-3333' },
  { id: '3', name: 'David Martinez', phone: '(555) 333-4444' },
  { id: '4', name: 'Emily Brown', phone: '(555) 444-5555' },
]

export default function CreateWorkOrder() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: {
      customerId: '',
      serviceAddress: '',
      useDifferentAddress: false,
      contactPerson: '',
      contactPhone: '',
      jobType: 'repair',
      priority: 'medium',
      description: '',
      customerNotes: '',
      scheduledDate: '',
      timeSlot: '',
      estimatedDuration: 60,
      technicianId: '',
      parts: [],
      equipmentNeeded: [],
      internalNotes: '',
      tags: [],
      attachments: [],
    },
  })

  const onSubmit = async (data: WorkOrderFormData) => {
    setIsSubmitting(true)
    try {
      await api.post('/work-orders', {
        title: `${data.jobType} - ${data.description.slice(0, 50)}`,
        description: data.description,
        customerName: data.contactPerson || 'TBD',
        address: data.serviceAddress,
        scheduledDate: data.scheduledDate,
        priority: data.priority.toUpperCase(),
      })
      toast.success('Work order created successfully!')
      navigate('/work-orders')
    } catch (error) {
      console.error('Error creating work order:', error)
      toast.error('Failed to create work order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    localStorage.setItem('workorder_draft', JSON.stringify(values))
    toast.success('Draft saved to local storage!')
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/work-orders')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <WorkOrderFormHeader isEditing={false} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-24">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <CustomerSection form={form} customers={mockCustomers} />
          <JobDetailsSection form={form} />
          <SchedulingSection form={form} technicians={mockTechnicians} />
          <PartsSection form={form} />
          <AdditionalSection form={form} />
        </div>
      </form>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={handleSaveDraft}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
            >
              Save as Draft
            </Button>
            <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-red-400 transition-colors">
              Cancel
            </button>
          </div>

          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Work Order'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
