import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { K1Document, ComplianceItem, ActivityLog } from '@/types/dataroom';

function castRows<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}
function castRow<T>(data: unknown): T | null {
  return (data ?? null) as T | null;
}

// ============================================
// K-1 DOCUMENTS
// ============================================

export function useK1Documents(filters?: { investmentId?: string; clientId?: string; taxYear?: number }) {
  return useQuery({
    queryKey: ['k1-documents', filters],
    queryFn: async () => {
      let query = supabase.from('k1_documents').select('*').order('tax_year', { ascending: false });
      if (filters?.investmentId) query = query.eq('investment_id', filters.investmentId);
      if (filters?.clientId) query = query.eq('client_id', filters.clientId);
      if (filters?.taxYear) query = query.eq('tax_year', filters.taxYear);
      const { data, error } = await query;
      if (error) throw error;
      return castRows<K1Document>(data);
    },
  });
}

export function useCreateK1() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (k1: Partial<K1Document>) => {
      const { data, error } = await supabase.from('k1_documents').insert(k1 as Record<string, unknown>).select().single();
      if (error) throw error;
      return castRow<K1Document>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['k1-documents'] }),
  });
}

export function useUpdateK1() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<K1Document> & { id: string }) => {
      const { data, error } = await supabase.from('k1_documents').update(updates as Record<string, unknown>).eq('id', id).select().single();
      if (error) throw error;
      return castRow<K1Document>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['k1-documents'] }),
  });
}

export function useDeleteK1() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('k1_documents').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['k1-documents'] }),
  });
}

// ============================================
// COMPLIANCE ITEMS
// ============================================

export function useComplianceItems(investmentId?: string) {
  return useQuery({
    queryKey: ['compliance-items', investmentId],
    queryFn: async () => {
      let query = supabase.from('compliance_items').select('*').order('due_date', { ascending: true });
      if (investmentId) query = query.eq('investment_id', investmentId);
      const { data, error } = await query;
      if (error) throw error;
      return castRows<ComplianceItem>(data);
    },
  });
}

export function useCreateComplianceItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<ComplianceItem>) => {
      const { data, error } = await supabase.from('compliance_items').insert(item as Record<string, unknown>).select().single();
      if (error) throw error;
      return castRow<ComplianceItem>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['compliance-items'] }),
  });
}

export function useUpdateComplianceItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ComplianceItem> & { id: string }) => {
      const { data, error } = await supabase.from('compliance_items').update(updates as Record<string, unknown>).eq('id', id).select().single();
      if (error) throw error;
      return castRow<ComplianceItem>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['compliance-items'] }),
  });
}

export function useDeleteComplianceItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('compliance_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['compliance-items'] }),
  });
}

// ============================================
// ACTIVITY LOGS
// ============================================

export function useActivityLogs(filters?: { userId?: string; entityType?: string; limit?: number }) {
  return useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: async () => {
      let query = supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
      if (filters?.userId) query = query.eq('user_id', filters.userId);
      if (filters?.entityType) query = query.eq('entity_type', filters.entityType);
      query = query.limit(filters?.limit ?? 100);
      const { data, error } = await query;
      if (error) throw error;
      return castRows<ActivityLog>(data);
    },
  });
}

export function useCreateActivityLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (log: Partial<ActivityLog>) => {
      const { data, error } = await supabase.from('activity_logs').insert(log as Record<string, unknown>).select().single();
      if (error) throw error;
      return castRow<ActivityLog>(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activity-logs'] }),
  });
}
