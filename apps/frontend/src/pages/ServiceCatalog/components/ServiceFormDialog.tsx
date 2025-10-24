import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { serviceCatalogApi, ServiceCatalog } from '@/services/serviceCatalogApi';
import toast from 'react-hot-toast';

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: ServiceCatalog;
}

export function ServiceFormDialog({ open, onClose, onSuccess, service }: ServiceFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceCode: '',
    category: '',
    subcategory: '',
    description: '',
    pricingType: 'flat_rate' as 'flat_rate' | 'hourly' | 'time_and_material',
    basePrice: '',
    estimatedHours: '',
    durationMinutes: '',
    warrantyDays: '',
    customerFacingNotes: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName,
        serviceCode: service.serviceCode,
        category: service.category,
        subcategory: service.subcategory || '',
        description: service.description || '',
        pricingType: service.pricingType,
        basePrice: service.basePrice.toString(),
        estimatedHours: service.estimatedHours?.toString() || '',
        durationMinutes: service.durationMinutes?.toString() || '',
        warrantyDays: service.warrantyDays?.toString() || '',
        customerFacingNotes: service.customerFacingNotes || '',
      });
    } else {
      setFormData({
        serviceName: '',
        serviceCode: '',
        category: '',
        subcategory: '',
        description: '',
        pricingType: 'flat_rate',
        basePrice: '',
        estimatedHours: '',
        durationMinutes: '',
        warrantyDays: '',
        customerFacingNotes: '',
      });
    }
  }, [service, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        serviceName: formData.serviceName,
        serviceCode: formData.serviceCode,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        description: formData.description || undefined,
        pricingType: formData.pricingType,
        basePrice: parseFloat(formData.basePrice),
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
        warrantyDays: formData.warrantyDays ? parseInt(formData.warrantyDays) : undefined,
        customerFacingNotes: formData.customerFacingNotes || undefined,
        isActive: true,
      };

      if (service) {
        await serviceCatalogApi.updateService(service.id, data);
        toast.success('Service updated successfully');
      } else {
        await serviceCatalogApi.createService(data);
        toast.success('Service created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(service ? 'Failed to update service' : 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Create Service'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Service Name *</Label>
              <Input
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Service Code *</Label>
              <Input
                value={formData.serviceCode}
                onChange={(e) => setFormData({ ...formData, serviceCode: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Subcategory</Label>
              <Input
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pricing Type *</Label>
              <Select
                value={formData.pricingType}
                onValueChange={(value: any) => setFormData({ ...formData, pricingType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat_rate">Flat Rate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="time_and_material">Time & Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Base Price * {formData.pricingType === 'hourly' && '(per hour)'}</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Estimated Hours</Label>
              <Input
                type="number"
                step="0.25"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
              />
            </div>
            <div>
              <Label>Warranty (days)</Label>
              <Input
                type="number"
                value={formData.warrantyDays}
                onChange={(e) => setFormData({ ...formData, warrantyDays: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Customer Facing Notes</Label>
            <Textarea
              value={formData.customerFacingNotes}
              onChange={(e) => setFormData({ ...formData, customerFacingNotes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
