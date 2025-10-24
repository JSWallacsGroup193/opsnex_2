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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { crmService } from '@/services/crm.service'
import { toast } from 'react-hot-toast'

const propertySchema = z.object({
  propertyType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'], {
    required_error: 'Property type is required',
  }),
  squareFootage: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || Number.isNaN(Number(val)) ? null : Number(val)),
    z.number().int().positive().nullable().optional()
  ),
  accessNotes: z.string().optional().nullable(),
  gateCode: z.string().optional().nullable(),
  parkingInstructions: z.string().optional().nullable(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface AddPropertyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: string
  onSuccess?: () => void
}

export function AddPropertyDialog({ open, onOpenChange, accountId, onSuccess }: AddPropertyDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyType: 'RESIDENTIAL',
      squareFootage: null,
      accessNotes: '',
      gateCode: '',
      parkingInstructions: '',
    },
  })

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const payload: any = {
        accountId,
        propertyType: data.propertyType,
      }

      if (data.squareFootage) {
        payload.squareFootage = data.squareFootage
      }
      if (data.accessNotes) {
        payload.accessNotes = data.accessNotes
      }
      if (data.gateCode) {
        payload.gateCode = data.gateCode
      }
      if (data.parkingInstructions) {
        payload.parkingInstructions = data.parkingInstructions
      }

      await crmService.createProperty(payload)
      
      toast.success('Property added successfully')
      reset()
      onOpenChange(false)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error creating property:', error)
      const message = error?.response?.data?.message || 'Failed to add property'
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Add Property</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new property to this customer account
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType" className="text-white">
              Property Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="RESIDENTIAL" className="text-white">Residential</SelectItem>
                    <SelectItem value="COMMERCIAL" className="text-white">Commercial</SelectItem>
                    <SelectItem value="INDUSTRIAL" className="text-white">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.propertyType && (
              <p className="text-sm text-red-500">{errors.propertyType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="squareFootage" className="text-white">
              Square Footage
            </Label>
            <Input
              id="squareFootage"
              type="number"
              placeholder="e.g., 2500"
              {...register('squareFootage')}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            {errors.squareFootage && (
              <p className="text-sm text-red-500">{errors.squareFootage.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessNotes" className="text-white">
              Access Notes
            </Label>
            <Textarea
              id="accessNotes"
              placeholder="Special access instructions..."
              {...register('accessNotes')}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gateCode" className="text-white">
                Gate Code
              </Label>
              <Input
                id="gateCode"
                placeholder="e.g., #1234"
                {...register('gateCode')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingInstructions" className="text-white">
                Parking
              </Label>
              <Input
                id="parkingInstructions"
                placeholder="e.g., Driveway"
                {...register('parkingInstructions')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
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
              {isSubmitting ? 'Adding...' : 'Add Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
