import { useState, useEffect } from 'react';
import { Shield, Users } from 'lucide-react';
import { adminService } from '@/services/admin.service';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  isSystem: boolean;
  users: Array<{ userId: string }>;
  permissions: Array<{
    permission: {
      id: string;
      name: string;
      category: string;
    };
  }>;
}

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAllRoles()
      .then((res) => setRoles(res))
      .catch((err) => console.error('Failed to load roles:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Role Management</h1>
          <p className="text-slate-400 mt-2">Manage roles and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-teal-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-teal-500/10">
                  <Shield className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {role.displayName || role.name}
                  </h3>
                  {role.isSystem && (
                    <span className="inline-block px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded mt-1">
                      System
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              {role.description || 'No description'}
            </p>

            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{role.users.length} users</span>
                </div>
                <div className="text-slate-400">
                  {role.permissions.length} permissions
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
