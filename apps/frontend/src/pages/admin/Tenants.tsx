import { useState, useEffect } from 'react';
import { Building2, Users, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '@/services/admin.service';

interface Tenant {
  id: string;
  name: string;
  isActive: boolean;
  plan: string;
  users: Array<{ id: string; isActive: boolean }>;
}

export default function AdminTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTenants = () => {
    setLoading(true);
    adminService
      .getAllTenants()
      .then((res) => setTenants(res))
      .catch((err) => console.error('Failed to load tenants:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const toggleStatus = async (tenantId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await adminService.deactivateTenant(tenantId);
      } else {
        await adminService.activateTenant(tenantId);
      }
      loadTenants();
    } catch (err) {
      console.error('Failed to toggle tenant status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Tenant Management</h1>
        <p className="text-slate-400 mt-2">Manage organizations and subscriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => {
          const activeUsers = tenant.users.filter((u) => u.isActive).length;

          return (
            <div
              key={tenant.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-teal-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-teal-500/10">
                    <Building2 className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{tenant.name}</h3>
                    <p className="text-sm text-slate-400">{tenant.plan || 'Free'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{tenant.users.length} total users</span>
                  </div>
                  <span className="text-teal-400">{activeUsers} active</span>
                </div>

                <div>
                  {tenant.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      <XCircle className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleStatus(tenant.id, tenant.isActive)}
                className="w-full px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors"
              >
                {tenant.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
