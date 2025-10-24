import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import api from '@/utils/axiosClient'
import { toast } from 'react-hot-toast'

const equipmentSchema = z.object({
  equipmentType: z.string().min(1, 'Equipment type is required'),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  capacity: z.string().optional().nullable(),
  efficiency: z.string().optional().nullable(),
  installDate: z.string().optional().nullable(),
  installedBy: z.string().optional().nullable(),
  refrigerantType: z.string().optional().nullable(),
  warrantyStartDate: z.string().optional().nullable(),
  warrantyEndDate: z.string().optional().nullable(),
  warrantyProvider: z.string().optional().nullable(),
})

type EquipmentFormData = z.infer<typeof equipmentSchema>

interface AddEquipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  onSuccess?: () => void
}

export function AddEquipmentDialog({ open, onOpenChange, propertyId, onSuccess }: AddEquipmentDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      equipmentType: 'HVAC',
      make: '',
      model: '',
      serialNumber: '',
      capacity: '',
      efficiency: '',
      installDate: '',
      installedBy: '',
      refrigerantType: '',
      warrantyStartDate: '',
      warrantyEndDate: '',
      warrantyProvider: '',
    },
  })

  const onSubmit = async (data: EquipmentFormData) => {
    try {
      const payload: any = {
        propertyId,
        equipmentType: data.equipmentType,
      }

      if (data.make) payload.make = data.make
      if (data.model) payload.model = data.model
      if (data.serialNumber) payload.serialNumber = data.serialNumber
      if (data.capacity) payload.capacity = data.capacity
      if (data.efficiency) payload.efficiency = data.efficiency
      if (data.installDate) payload.installDate = data.installDate
      if (data.installedBy) payload.installedBy = data.installedBy
      if (data.refrigerantType) payload.refrigerantType = data.refrigerantType
      if (data.warrantyStartDate) payload.warrantyStartDate = data.warrantyStartDate
      if (data.warrantyEndDate) payload.warrantyEndDate = data.warrantyEndDate
      if (data.warrantyProvider) payload.warrantyProvider = data.warrantyProvider

      await api.post('/customer-equipment', payload)
      
      toast.success('Equipment added successfully')
      reset()
      onOpenChange(false)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error creating equipment:', error)
      const message = error?.response?.data?.message || 'Failed to add equipment'
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Add Equipment</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add new equipment to this property
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="equipmentType" className="text-white">
              Equipment Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="equipmentType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="HVAC" className="text-white">HVAC System</SelectItem>
                    <SelectItem value="Furnace" className="text-white">Furnace</SelectItem>
                    <SelectItem value="AC Unit" className="text-white">AC Unit</SelectItem>
                    <SelectItem value="Heat Pump" className="text-white">Heat Pump</SelectItem>
                    <SelectItem value="Boiler" className="text-white">Boiler</SelectItem>
                    <SelectItem value="Water Heater" className="text-white">Water Heater</SelectItem>
                    <SelectItem value="Thermostat" className="text-white">Thermostat</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.equipmentType && (
              <p className="text-sm text-red-500">{errors.equipmentType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-white">Manufacturer</Label>
              <Input
                id="make"
                placeholder="e.g., Carrier"
                {...register('make')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-white">Model</Label>
              <Input
                id="model"
                placeholder="e.g., Infinity 24"
                {...register('model')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber" className="text-white">Serial Number</Label>
            <Input
              id="serialNumber"
              placeholder="e.g., CAR-2022-12345"
              {...register('serialNumber')}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-white">Capacity</Label>
              <Input
                id="capacity"
                placeholder="e.g., 3.5 Tons"
                {...register('capacity')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="efficiency" className="text-white">Efficiency</Label>
              <Input
                id="efficiency"
                placeholder="e.g., 16 SEER"
                {...register('efficiency')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installDate" className="text-white">Install Date</Label>
              <Input
                id="installDate"
                type="date"
                {...register('installDate')}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installedBy" className="text-white">Installed By</Label>
              <Input
                id="installedBy"
                placeholder="Company name"
                {...register('installedBy')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refrigerantType" className="text-white">Refrigerant Type</Label>
            <Input
              id="refrigerantType"
              placeholder="e.g., R-410A"
              {...register('refrigerantType')}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warrantyStartDate" className="text-white">Warranty Start</Label>
              <Input
                id="warrantyStartDate"
                type="date"
                {...register('warrantyStartDate')}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyEndDate" className="text-white">Warranty End</Label>
              <Input
                id="warrantyEndDate"
                type="date"
                {...register('warrantyEndDate')}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyProvider" className="text-white">Warranty Provider</Label>
            <Input
              id="warrantyProvider"
              placeholder="e.g., Manufacturer's Warranty"
              {...register('warrantyProvider')}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
              disabled={isSubmitting}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add Equipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
