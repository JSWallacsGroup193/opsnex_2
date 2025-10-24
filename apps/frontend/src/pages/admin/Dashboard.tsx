import { useState, useEffect } from 'react';
import { Users, Shield, Key, Building2 } from 'lucide-react';
import { adminService } from '@/services/admin.service';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  tenants: number;
  roles: number;
  permissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setStats(res))
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Users',
      value: stats?.users.total || 0,
      subtitle: `${stats?.users.active || 0} active`,
      icon: Users,
      color: 'teal',
    },
    {
      title: 'Tenants',
      value: stats?.tenants || 0,
      icon: Building2,
      color: 'blue',
    },
    {
      title: 'Roles',
      value: stats?.roles || 0,
      icon: Shield,
      color: 'purple',
    },
    {
      title: 'Permissions',
      value: stats?.permissions || 0,
      icon: Key,
      color: 'orange',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Super Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">System-wide management and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-teal-500/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${card.color}-500/10`}>
                <card.icon className={`w-6 h-6 text-${card.color}-500`} />
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-slate-100">{card.value}</p>
            {card.subtitle && (
              <p className="text-slate-500 text-sm mt-2">{card.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center"
          >
            <Users className="w-8 h-8 text-teal-500 mx-auto mb-2" />
            <p className="text-slate-100 font-medium">Manage Users</p>
          </a>
          <a
            href="/admin/roles"
            className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center"
          >
            <Shield className="w-8 h-8 text-teal-500 mx-auto mb-2" />
            <p className="text-slate-100 font-medium">Manage Roles</p>
          </a>
          <a
            href="/admin/tenants"
            className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center"
          >
            <Building2 className="w-8 h-8 text-teal-500 mx-auto mb-2" />
            <p className="text-slate-100 font-medium">Manage Tenants</p>
          </a>
        </div>
      </div>
    </div>
  );
}
