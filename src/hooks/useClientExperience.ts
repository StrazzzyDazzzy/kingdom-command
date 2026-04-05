import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Notification, ClientOnboarding } from '@/types/dataroom';
import { useAuth } from '@/lib/auth';

function castRows<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}
function castRow<T>(data: unknown): T | null {
  return (data ?? null) as T | null;
}

// ============================================
// NOTIFICATIONS
// ============================================

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return castRows<Notification>(data);
    },
    enabled: !!user?.id,
  });
}

export function useUnreadCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications-unread', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('is_read', false);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notifications').update({ is_read: true } as Record<string, unknown>).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
}

export function useMarkAllRead() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true } as Record<string, unknown>)
        .eq('user_id', user!.id)
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
}

export function useCreateNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notification: Partial<Notification>) => {
      const { data, error } = await supabase.from('notifications').insert(notification as Record<string, unknown>).select().single();
      if (error) throw error;
      return castRow<Notification>(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
}

// ============================================
// CLIENT ONBOARDING
// ============================================

export function useOnboarding() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_onboarding')
        .select('*')
        .eq('client_id', user!.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return castRow<ClientOnboarding>(data);
    },
    enabled: !!user?.id,
  });
}

export function useUpsertOnboarding() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<ClientOnboarding>) => {
      const { data, error } = await supabase
        .from('client_onboarding')
        .upsert({ client_id: user!.id, ...updates } as Record<string, unknown>, { onConflict: 'client_id' })
        .select()
        .single();
      if (error) throw error;
      return castRow<ClientOnboarding>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['onboarding'] }),
  });
}

// Admin: view all onboarding records
export function useAllOnboarding() {
  return useQuery({
    queryKey: ['all-onboarding'],
    queryFn: async () => {
      const { data, error } = await supabase.from('client_onboarding').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return castRows<ClientOnboarding>(data);
    },
  });
}
