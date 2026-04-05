import { useState } from 'react';
import { PortalLayout } from '@/components/shared/PortalLayout';
import { useAllProfiles } from '@/hooks/useAffiliate';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Shield, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const roleColors: Record<string, string> = {
  admin: 'bg-primary/10 text-primary border-primary/30',
  client: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  affiliate: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
};

type ProfileRow = { id: string; email: string; full_name: string; role: string; is_active: boolean; created_at: string; assigned_rm: string | null };

export default function UserManagement() {
  const { data: profiles = [], isLoading } = useAllProfiles();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { toast } = useToast();
  const qc = useQueryClient();

  const typed = profiles as ProfileRow[];

  const filtered = typed.filter((p) => {
    if (roleFilter && p.role !== roleFilter) return false;
    if (search && !`${p.full_name} ${p.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleRoleChange = async (id: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role } as Record<string, unknown>).eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Role updated' });
    qc.invalidateQueries({ queryKey: ['all-profiles'] });
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from('profiles').update({ is_active: !isActive } as Record<string, unknown>).eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: isActive ? 'User deactivated' : 'User activated' });
    qc.invalidateQueries({ queryKey: ['all-profiles'] });
  };

  const stats = {
    total: typed.length,
    admins: typed.filter((p) => p.role === 'admin').length,
    clients: typed.filter((p) => p.role === 'client').length,
    affiliates: typed.filter((p) => p.role === 'affiliate').length,
  };

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users, roles, and access</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="text-2xl font-mono font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Users</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="text-2xl font-mono font-bold text-primary">{stats.admins}</div>
            <div className="text-xs text-muted-foreground mt-1">Admins</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="text-2xl font-mono font-bold text-blue-400">{stats.clients}</div>
            <div className="text-xs text-muted-foreground mt-1">Clients</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="text-2xl font-mono font-bold text-teal-400">{stats.affiliates}</div>
            <div className="text-xs text-muted-foreground mt-1">Affiliates</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="affiliate">Affiliate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">User</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Role</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Joined</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground"><Users className="mx-auto h-8 w-8 mb-2 opacity-30" />No users found</td></tr>
                ) : filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">{p.full_name?.charAt(0) ?? '?'}</div>
                        <span className="text-sm font-medium">{p.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3">
                      <Select value={p.role} onValueChange={(v) => handleRoleChange(p.id, v)}>
                        <SelectTrigger className="w-[120px] h-7 text-xs border-0 bg-transparent p-0">
                          <Badge variant="outline" className={roleColors[p.role] ?? ''}><Shield className="h-3 w-3 mr-1" />{p.role}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="affiliate">Affiliate</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      {p.is_active ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30"><UserCheck className="h-3 w-3 mr-1" />Active</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30"><UserX className="h-3 w-3 mr-1" />Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleToggleActive(p.id, p.is_active)}>
                        {p.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
