import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { serviceCatalogApi, LaborRate } from '@/services/serviceCatalogApi';
import toast from 'react-hot-toast';

interface LaborRateFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  laborRate?: LaborRate;
}

export function LaborRateFormDialog({ open, onClose, onSuccess, laborRate }: LaborRateFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rateName: '',
    rateType: 'regular',
    skillLevel: '',
    hourlyRate: '',
    isDefault: false,
    afterHoursMultiplier: '',
    description: '',
  });

  useEffect(() => {
    if (laborRate) {
      setFormData({
        rateName: laborRate.rateName,
        rateType: laborRate.rateType,
        skillLevel: laborRate.skillLevel || '',
        hourlyRate: laborRate.hourlyRate.toString(),
        isDefault: laborRate.isDefault,
        afterHoursMultiplier: laborRate.afterHoursMultiplier?.toString() || '',
        description: laborRate.description || '',
      });
    } else {
      setFormData({
        rateName: '',
        rateType: 'regular',
        skillLevel: '',
        hourlyRate: '',
        isDefault: false,
        afterHoursMultiplier: '',
        description: '',
      });
    }
  }, [laborRate, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        rateName: formData.rateName,
        rateType: formData.rateType,
        skillLevel: formData.skillLevel || undefined,
        hourlyRate: parseFloat(formData.hourlyRate),
        isDefault: formData.isDefault,
        afterHoursMultiplier: formData.afterHoursMultiplier ? parseFloat(formData.afterHoursMultiplier) : undefined,
        description: formData.description || undefined,
        isActive: true,
      };

      if (laborRate) {
        await serviceCatalogApi.updateLaborRate(laborRate.id, data);
        toast.success('Labor rate updated successfully');
      } else {
        await serviceCatalogApi.createLaborRate(data);
        toast.success('Labor rate created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(laborRate ? 'Failed to update labor rate' : 'Failed to create labor rate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{laborRate ? 'Edit Labor Rate' : 'Create Labor Rate'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rate Name *</Label>
            <Input
              value={formData.rateName}
              onChange={(e) => setFormData({ ...formData, rateName: e.target.value })}
              placeholder="e.g., Standard Rate, Emergency Rate"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rate Type *</Label>
              <Select
                value={formData.rateType}
                onValueChange={(value) => setFormData({ ...formData, rateType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="after_hours">After Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Skill Level</Label>
              <Select
                value={formData.skillLevel}
                onValueChange={(value) => setFormData({ ...formData, skillLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="apprentice">Apprentice</SelectItem>
                  <SelectItem value="journeyman">Journeyman</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Hourly Rate * ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>After Hours Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.afterHoursMultiplier}
                onChange={(e) => setFormData({ ...formData, afterHoursMultiplier: e.target.value })}
                placeholder="e.g., 1.5 for 50% extra"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
            />
            <Label htmlFor="isDefault" className="cursor-pointer">Set as default rate</Label>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Optional description of this labor rate"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : laborRate ? 'Update Rate' : 'Create Rate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
