import { supabase } from '@/integrations/supabase/client';

interface LogActivityParams {
  action: string;
  entityType: string;
  entityId?: string | null;
  entityName?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Log a user-initiated activity. Most CRUD actions are logged
 * automatically via DB triggers, but this handles client-side
 * events like document views/downloads that don't hit a mutation.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    entity_name: params.entityName ?? null,
    metadata: params.metadata ?? {},
  } as Record<string, unknown>);
}

/**
 * Create a notification for a specific user.
 * Use for admin-triggered events (e.g., uploading a new document,
 * announcing an investment) that need to reach clients.
 */
export async function createNotification(params: {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'action_required' | 'document' | 'k1' | 'investment';
  actionUrl?: string;
}): Promise<void> {
  await supabase.from('notifications').insert({
    user_id: params.userId,
    title: params.title,
    message: params.message,
    type: params.type ?? 'info',
    action_url: params.actionUrl ?? null,
  } as Record<string, unknown>);
}

/**
 * Broadcast a notification to all users with a specific role.
 */
export async function broadcastNotification(params: {
  role: 'admin' | 'client' | 'affiliate';
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'action_required' | 'document' | 'k1' | 'investment';
  actionUrl?: string;
}): Promise<void> {
  const { data: profiles } = await supabase.from('profiles').select('id').eq('role', params.role);
  if (!profiles || profiles.length === 0) return;

  const rows = (profiles as Array<{ id: string }>).map((p) => ({
    user_id: p.id,
    title: params.title,
    message: params.message,
    type: params.type ?? 'info',
    action_url: params.actionUrl ?? null,
  }));

  await supabase.from('notifications').insert(rows as Record<string, unknown>[]);
}
