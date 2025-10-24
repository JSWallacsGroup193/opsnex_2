import { useEffect, useState } from 'react';
import { serviceCatalogApi, LaborRate } from '@/services/serviceCatalogApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { LaborRateFormDialog } from './LaborRateFormDialog';

export function LaborRatesTab() {
  const [laborRates, setLaborRates] = useState<LaborRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<LaborRate | undefined>();

  useEffect(() => {
    loadLaborRates();
  }, []);

  const loadLaborRates = async () => {
    try {
      const data = await serviceCatalogApi.getLaborRates();
      setLaborRates(data);
    } catch (error) {
      toast.error('Failed to load labor rates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this labor rate?')) return;
    
    try {
      await serviceCatalogApi.deleteLaborRate(id);
      toast.success('Labor rate deleted successfully');
      loadLaborRates();
    } catch (error) {
      toast.error('Failed to delete labor rate');
    }
  };

  const handleEdit = (rate: LaborRate) => {
    setEditingRate(rate);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRate(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingRate(undefined);
  };

  if (loading) {
    return <div className="text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <LaborRateFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={loadLaborRates}
        laborRate={editingRate}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Labor Rates</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Labor Rate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {laborRates.map((rate) => (
          <Card key={rate.id} className="p-4 bg-slate-800 border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-teal-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-100">{rate.rateName}</h3>
                  <p className="text-xs text-slate-400 capitalize">{rate.rateType.replace('_', ' ')}</p>
                </div>
              </div>
              {rate.isDefault && (
                <span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-400">
                  Default
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-teal-400 mb-2">
              ${Number(rate.hourlyRate).toFixed(2)}/hr
            </p>

            {rate.skillLevel && (
              <p className="text-xs text-slate-400 mb-2 capitalize">
                Skill Level: {rate.skillLevel}
              </p>
            )}

            {rate.afterHoursMultiplier && (
              <p className="text-xs text-orange-400 mb-2">
                After Hours: {Number(rate.afterHoursMultiplier)}x
              </p>
            )}

            {rate.description && (
              <p className="text-xs text-slate-400 mb-3">{rate.description}</p>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(rate)}>
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDelete(rate.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {laborRates.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No labor rates found. Create your first labor rate to get started.</p>
        </div>
      )}
    </div>
  );
}
