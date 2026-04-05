import { useState } from 'react';
import { PortalLayout } from '@/components/shared/PortalLayout';
import { useActivityLogs } from '@/hooks/useCompliance';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, Search, FileText, Users, Building2, Shield, MessageSquare, Download } from 'lucide-react';

const entityIcons: Record<string, React.ReactNode> = {
  investment: <Building2 className="h-4 w-4 text-primary" />,
  document: <FileText className="h-4 w-4 text-teal-400" />,
  user: <Users className="h-4 w-4 text-blue-400" />,
  compliance: <Shield className="h-4 w-4 text-orange-400" />,
  k1: <Download className="h-4 w-4 text-green-400" />,
  ai: <MessageSquare className="h-4 w-4 text-purple-400" />,
};

const actionColors: Record<string, string> = {
  created: 'bg-green-500/10 text-green-400',
  updated: 'bg-blue-500/10 text-blue-400',
  deleted: 'bg-red-500/10 text-red-400',
  viewed: 'bg-slate-500/10 text-slate-400',
  downloaded: 'bg-teal-500/10 text-teal-400',
  distributed: 'bg-primary/10 text-primary',
};

export default function ActivityLogs() {
  const [entityFilter, setEntityFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: logs = [], isLoading } = useActivityLogs({ entityType: entityFilter || undefined, limit: 200 });

  const filtered = search
    ? logs.filter((l) => `${l.action} ${l.entity_type} ${l.entity_name ?? ''}`.toLowerCase().includes(search.toLowerCase()))
    : logs;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete audit trail of platform actions</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search activity..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="k1">K-1</SelectItem>
              <SelectItem value="ai">AI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading activity...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p>No activity recorded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filtered.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-muted/5 transition-colors">
                  <div className="mt-0.5">{entityIcons[log.entity_type] ?? <Activity className="h-4 w-4 text-muted-foreground" />}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={actionColors[log.action] ?? 'bg-muted/10'}>{log.action}</Badge>
                      <span className="text-sm">{log.entity_type}</span>
                      {log.entity_name && <span className="text-sm text-primary font-medium">{log.entity_name}</span>}
                    </div>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{JSON.stringify(log.metadata).slice(0, 120)}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(log.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
