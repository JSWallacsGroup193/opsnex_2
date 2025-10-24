import { useEffect, useState } from 'react';
import { serviceCatalogApi, ServiceBundle } from '@/services/serviceCatalogApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { BundleFormDialog } from './BundleFormDialog';

export function BundlesTab() {
  const [bundles, setBundles] = useState<ServiceBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<ServiceBundle | undefined>();

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    try {
      const data = await serviceCatalogApi.getBundles();
      setBundles(data);
    } catch (error) {
      toast.error('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    
    try {
      await serviceCatalogApi.deleteBundle(id);
      toast.success('Bundle deleted successfully');
      loadBundles();
    } catch (error) {
      toast.error('Failed to delete bundle');
    }
  };

  const handleEdit = (bundle: ServiceBundle) => {
    setEditingBundle(bundle);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingBundle(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingBundle(undefined);
  };

  if (loading) {
    return <div className="text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <BundleFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={loadBundles}
        bundle={editingBundle}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Service Bundles</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bundle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundles.map((bundle) => (
          <Card key={bundle.id} className="p-4 bg-slate-800 border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-2">
                <Package className="h-5 w-5 text-teal-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-100">{bundle.bundleName}</h3>
                  <p className="text-xs text-slate-400">{bundle.bundleCode}</p>
                </div>
              </div>
              {bundle.isPromotional && (
                <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">
                  Promo
                </span>
              )}
            </div>

            {bundle.description && (
              <p className="text-sm text-slate-400 mb-3">{bundle.description}</p>
            )}

            <div className="mb-3">
              <p className="text-xs text-slate-400 mb-1">Includes:</p>
              <ul className="text-xs text-slate-300 space-y-1">
                {bundle.items.map((item) => (
                  <li key={item.id}>
                    • {item.service.serviceName} {item.quantity > 1 && `(x${item.quantity})`}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs text-slate-400 line-through">
                  ${Number(bundle.regularPrice).toFixed(2)}
                </p>
                <p className="text-xl font-bold text-teal-400">
                  ${Number(bundle.bundlePrice).toFixed(2)}
                </p>
              </div>
              <p className="text-sm font-semibold text-green-400">
                Save ${Number(bundle.savings).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(bundle)}>
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDelete(bundle.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {bundles.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No service bundles found. Create your first bundle to get started.</p>
        </div>
      )}
    </div>
  );
}
