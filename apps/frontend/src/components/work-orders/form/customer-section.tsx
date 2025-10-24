import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { ChevronDown, ChevronUp, Plus, Search } from 'lucide-react'
import type { WorkOrderFormData } from '@/lib/validations/work-order-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Customer {
  id: string
  name: string
  accountNumber?: string
  phone: string
  email?: string
  address: string
}

interface CustomerSectionProps {
  form: UseFormReturn<WorkOrderFormData>
  customers: Customer[]
}

export function CustomerSection({ form, customers }: CustomerSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const selectedCustomerId = form.watch('customerId')
  const useDifferentAddress = form.watch('useDifferentAddress')

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCustomerSelect = (customer: Customer) => {
    form.setValue('customerId', customer.id)
    if (!useDifferentAddress) {
      form.setValue('serviceAddress', customer.address)
    }
    setShowDropdown(false)
    setSearchQuery('')
  }

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-600/50 transition-colors rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-slate-100">
          Customer Information <span className="text-red-400">*</span>
        </h2>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-600">
          {/* Customer Select */}
          <div className="space-y-2">
            <Label htmlFor="customer" className="text-slate-100">
              Customer <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="customer"
                  placeholder="Search customer by name, phone, or address..."
                  value={selectedCustomer ? selectedCustomer.name : searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                    if (selectedCustomer) {
                      form.setValue('customerId', '')
                    }
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {showDropdown && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => handleCustomerSelect(customer)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0"
                    >
                      <div className="font-medium text-slate-100">{customer.name}</div>
                      <div className="text-sm text-slate-400">{customer.phone}</div>
                      <div className="text-sm text-slate-400">{customer.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.formState.errors.customerId && (
              <p className="text-sm text-red-400">{form.formState.errors.customerId.message}</p>
            )}
            <button type="button" className="text-sm text-teal-500 hover:text-teal-400 flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Create New Customer
            </button>
          </div>

          {/* Service Address */}
          <div className="space-y-2">
            <Label htmlFor="serviceAddress" className="text-slate-100">
              Service Address <span className="text-red-400">*</span>
            </Label>
            <Input
              id="serviceAddress"
              {...form.register('serviceAddress')}
              disabled={!useDifferentAddress && !!selectedCustomer}
              placeholder="Enter service address..."
              className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
            />
            {form.formState.errors.serviceAddress && (
              <p className="text-sm text-red-400">{form.formState.errors.serviceAddress.message}</p>
            )}
            {selectedCustomer && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="useDifferentAddress"
                  checked={useDifferentAddress}
                  onCheckedChange={(checked) => {
                    form.setValue('useDifferentAddress', checked as boolean)
                    if (!checked) {
                      form.setValue('serviceAddress', selectedCustomer.address)
                    }
                  }}
                  className="border-slate-600 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                />
                <Label htmlFor="useDifferentAddress" className="text-sm text-slate-300 cursor-pointer">
                  Use different address
                </Label>
              </div>
            )}
          </div>

          {/* Contact Person */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-slate-100">
                Contact Person (if different)
              </Label>
              <Input
                id="contactPerson"
                {...form.register('contactPerson')}
                placeholder="Contact name..."
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-slate-100">
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                {...form.register('contactPhone')}
                placeholder="(555) 123-4567"
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
