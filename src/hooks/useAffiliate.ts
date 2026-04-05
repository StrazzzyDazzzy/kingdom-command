import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AffiliateReferral, PlatformAnalytics } from '@/types/dataroom';
import { useAuth } from '@/lib/auth';

function castRows<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}
function castRow<T>(data: unknown): T | null {
  return (data ?? null) as T | null;
}

// ============================================
// AFFILIATE REFERRALS
// ============================================

export function useAffiliateReferrals(affiliateId?: string) {
  const { user } = useAuth();
  const targetId = affiliateId ?? user?.id;
  return useQuery({
    queryKey: ['affiliate-referrals', targetId],
    queryFn: async () => {
      let query = supabase.from('affiliate_referrals').select('*').order('created_at', { ascending: false });
      if (targetId) query = query.eq('affiliate_id', targetId);
      const { data, error } = await query;
      if (error) throw error;
      return castRows<AffiliateReferral>(data);
    },
    enabled: !!targetId,
  });
}

export function useCreateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (referral: Partial<AffiliateReferral>) => {
      const { data, error } = await supabase.from('affiliate_referrals').insert(referral as Record<string, unknown>).select().single();
      if (error) throw error;
      return castRow<AffiliateReferral>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliate-referrals'] }),
  });
}

export function useUpdateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AffiliateReferral> & { id: string }) => {
      const { data, error } = await supabase.from('affiliate_referrals').update(updates as Record<string, unknown>).eq('id', id).select().single();
      if (error) throw error;
      return castRow<AffiliateReferral>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliate-referrals'] }),
  });
}

export function useDeleteReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('affiliate_referrals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliate-referrals'] }),
  });
}

// ============================================
// ALL REFERRALS (Admin view)
// ============================================

export function useAllReferrals() {
  return useQuery({
    queryKey: ['all-referrals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('affiliate_referrals').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return castRows<AffiliateReferral>(data);
    },
  });
}

// ============================================
// PLATFORM ANALYTICS
// ============================================

export function usePlatformAnalytics(metricType?: string) {
  return useQuery({
    queryKey: ['platform-analytics', metricType],
    queryFn: async () => {
      let query = supabase.from('platform_analytics').select('*').order('metric_date', { ascending: false });
      if (metricType) query = query.eq('metric_type', metricType);
      query = query.limit(90);
      const { data, error } = await query;
      if (error) throw error;
      return castRows<PlatformAnalytics>(data);
    },
  });
}

// ============================================
// PROFILES (Admin user management)
// ============================================

export function useAllProfiles() {
  return useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
