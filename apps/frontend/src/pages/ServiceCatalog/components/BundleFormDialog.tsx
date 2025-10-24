import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { serviceCatalogApi, ServiceBundle } from '@/services/serviceCatalogApi';
import toast from 'react-hot-toast';

interface BundleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bundle?: ServiceBundle;
}

export function BundleFormDialog({ open, onClose, onSuccess, bundle }: BundleFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bundleName: '',
    bundleCode: '',
    description: '',
    category: '',
    bundlePrice: '',
    regularPrice: '',
    isPromotional: false,
  });

  useEffect(() => {
    if (bundle) {
      setFormData({
        bundleName: bundle.bundleName,
        bundleCode: bundle.bundleCode,
        description: bundle.description || '',
        category: bundle.category || '',
        bundlePrice: bundle.bundlePrice.toString(),
        regularPrice: bundle.regularPrice.toString(),
        isPromotional: bundle.isPromotional,
      });
    } else {
      setFormData({
        bundleName: '',
        bundleCode: '',
        description: '',
        category: '',
        bundlePrice: '',
        regularPrice: '',
        isPromotional: false,
      });
    }
  }, [bundle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bundlePrice = parseFloat(formData.bundlePrice);
      const regularPrice = parseFloat(formData.regularPrice);
      const savings = regularPrice - bundlePrice;
      const savingsPercent = (savings / regularPrice) * 100;

      const normalizedItems = bundle?.items?.map(item => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
        displayOrder: 1,
      })) || [];

      const data: any = {
        bundleName: formData.bundleName,
        bundleCode: formData.bundleCode,
        description: formData.description || undefined,
        category: formData.category || undefined,
        bundlePrice,
        regularPrice,
        savings,
        savingsPercent,
        isPromotional: formData.isPromotional,
        isActive: true,
        items: normalizedItems,
      };

      if (bundle) {
        await serviceCatalogApi.updateBundle(bundle.id, data);
        toast.success('Bundle updated successfully');
      } else {
        await serviceCatalogApi.createBundle(data);
        toast.success('Bundle created successfully. Add services to complete the bundle.');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(bundle ? 'Failed to update bundle' : 'Failed to create bundle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{bundle ? 'Edit Bundle' : 'Create Bundle'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bundle Name *</Label>
              <Input
                value={formData.bundleName}
                onChange={(e) => setFormData({ ...formData, bundleName: e.target.value })}
                placeholder="e.g., Spring Maintenance Package"
                required
              />
            </div>
            <div>
              <Label>Bundle Code *</Label>
              <Input
                value={formData.bundleCode}
                onChange={(e) => setFormData({ ...formData, bundleCode: e.target.value })}
                placeholder="e.g., SPRING-PKG"
                required
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe what's included in this bundle"
            />
          </div>

          <div>
            <Label>Category</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Seasonal, Maintenance"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Regular Price * ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.regularPrice}
                onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                placeholder="Combined price of individual services"
                required
              />
            </div>
            <div>
              <Label>Bundle Price * ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.bundlePrice}
                onChange={(e) => setFormData({ ...formData, bundlePrice: e.target.value })}
                placeholder="Discounted bundle price"
                required
              />
            </div>
          </div>

          {formData.regularPrice && formData.bundlePrice && (
            <div className="p-3 bg-slate-800 rounded-md">
              <p className="text-sm text-slate-300">
                Savings: ${(parseFloat(formData.regularPrice) - parseFloat(formData.bundlePrice)).toFixed(2)} 
                ({(((parseFloat(formData.regularPrice) - parseFloat(formData.bundlePrice)) / parseFloat(formData.regularPrice)) * 100).toFixed(1)}% off)
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="isPromotional"
              checked={formData.isPromotional}
              onCheckedChange={(checked) => setFormData({ ...formData, isPromotional: checked as boolean })}
            />
            <Label htmlFor="isPromotional" className="cursor-pointer">Mark as promotional bundle</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : bundle ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
