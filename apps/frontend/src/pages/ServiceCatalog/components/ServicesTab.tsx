import { useEffect, useState } from 'react';
import { serviceCatalogApi, ServiceCatalog } from '@/services/serviceCatalogApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ServiceFormDialog } from './ServiceFormDialog';

// Services management tab
export function ServicesTab() {
  const [services, setServices] = useState<ServiceCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCatalog | undefined>();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceCatalogApi.getServices();
      setServices(data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await serviceCatalogApi.deleteService(id);
      toast.success('Service deleted successfully');
      loadServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleEdit = (service: ServiceCatalog) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingService(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingService(undefined);
  };

  if (loading) {
    return <div className="text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <ServiceFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={loadServices}
        service={editingService}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Services</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-4 bg-slate-800 border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-slate-100">{service.serviceName}</h3>
                <p className="text-xs text-slate-400">{service.serviceCode}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-400">
                {service.pricingType.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-sm text-slate-300 mb-2">{service.category}</p>
            <p className="text-lg font-bold text-teal-400 mb-3">
              ${Number(service.basePrice).toFixed(2)}
              {service.pricingType === 'hourly' && '/hr'}
            </p>
            
            {service.description && (
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{service.description}</p>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(service)}>
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDelete(service.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No services found. Create your first service to get started.</p>
        </div>
      )}
    </div>
  );
}
