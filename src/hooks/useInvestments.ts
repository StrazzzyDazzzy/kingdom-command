import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Investment, InvestmentDocument, InvestmentVideo, InvestmentLink, InvestmentAudit, IrsCode, InvestmentScenario, DocType } from '@/types/dataroom';

// Cast helper since Supabase types are auto-generated and don't include our new tables yet
function castRows<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}
function castRow<T>(data: unknown): T | null {
  return (data ?? null) as T | null;
}

export function useInvestments(filters?: { category?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['investments', filters],
    queryFn: async () => {
      let query = supabase.from('investments').select('*').order('is_featured', { ascending: false }).order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return castRows<Investment>(data);
    },
  });
}

export function useInvestment(slug: string) {
  return useQuery({
    queryKey: ['investment', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return castRow<Investment>(data);
    },
    enabled: !!slug,
  });
}

export function useInvestmentDocuments(investmentId: string) {
  return useQuery({
    queryKey: ['investment-documents', investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_documents')
        .select('*')
        .eq('investment_id', investmentId)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return castRows<InvestmentDocument>(data);
    },
    enabled: !!investmentId,
  });
}

export function useInvestmentVideos(investmentId: string) {
  return useQuery({
    queryKey: ['investment-videos', investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_videos')
        .select('*')
        .eq('investment_id', investmentId)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return castRows<InvestmentVideo>(data);
    },
    enabled: !!investmentId,
  });
}

export function useInvestmentLinks(investmentId: string) {
  return useQuery({
    queryKey: ['investment-links', investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_links')
        .select('*')
        .eq('investment_id', investmentId);
      if (error) throw error;
      return castRows<InvestmentLink>(data);
    },
    enabled: !!investmentId,
  });
}

export function useInvestmentAudits(investmentId: string) {
  return useQuery({
    queryKey: ['investment-audits', investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_audits')
        .select('*')
        .eq('investment_id', investmentId)
        .order('audit_year', { ascending: false });
      if (error) throw error;
      return castRows<InvestmentAudit>(data);
    },
    enabled: !!investmentId,
  });
}

export function useIrsCodes() {
  return useQuery({
    queryKey: ['irs-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('irs_codes')
        .select('*')
        .order('code_number');
      if (error) throw error;
      return castRows<IrsCode>(data);
    },
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (investment: Partial<Investment>) => {
      const { data, error } = await supabase
        .from('investments')
        .insert(investment as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return castRow<Investment>(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });
}

export function useUpdateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Investment> & { id: string }) => {
      const { data, error } = await supabase
        .from('investments')
        .update(updates as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return castRow<Investment>(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });
}

export function useInvestmentScenarios(investmentId: string) {
  return useQuery({
    queryKey: ['investment-scenarios', investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_scenarios')
        .select('*')
        .eq('investment_id', investmentId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return castRows<InvestmentScenario>(data);
    },
    enabled: !!investmentId,
  });
}

export function useCreateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scenario: Partial<InvestmentScenario>) => {
      const { data, error } = await supabase
        .from('investment_scenarios')
        .insert(scenario as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return castRow<InvestmentScenario>(data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-scenarios', variables.investment_id] });
    },
  });
}

// ============================================
// DOCUMENT CRUD
// ============================================

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doc: {
      investment_id: string;
      doc_type: DocType;
      file_name: string;
      file_url: string;
      file_size?: number | null;
      page_count?: number | null;
      is_affiliate_visible?: boolean;
      is_client_visible?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('investment_documents')
        .insert(doc as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return castRow<InvestmentDocument>(data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-documents', variables.investment_id] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, investmentId }: { id: string; investmentId: string }) => {
      const { error } = await supabase.from('investment_documents').delete().eq('id', id);
      if (error) throw error;
      return investmentId;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-documents', variables.investmentId] });
    },
  });
}

// ============================================
// VIDEO CRUD
// ============================================

export function useCreateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (video: {
      investment_id: string;
      title: string;
      embed_url: string;
      platform?: string;
      description?: string | null;
      is_affiliate_visible?: boolean;
      display_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('investment_videos')
        .insert(video as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return castRow<InvestmentVideo>(data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-videos', variables.investment_id] });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, investmentId }: { id: string; investmentId: string }) => {
      const { error } = await supabase.from('investment_videos').delete().eq('id', id);
      if (error) throw error;
      return investmentId;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-videos', variables.investmentId] });
    },
  });
}

// ============================================
// LINK CRUD
// ============================================

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (link: {
      investment_id: string;
      label: string;
      url: string;
      link_type?: string | null;
      is_public?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('investment_links')
        .insert(link as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return castRow<InvestmentLink>(data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-links', variables.investment_id] });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, investmentId }: { id: string; investmentId: string }) => {
      const { error } = await supabase.from('investment_links').delete().eq('id', id);
      if (error) throw error;
      return investmentId;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-links', variables.investmentId] });
    },
  });
}

// ============================================
// AUDIT CRUD
// ============================================

export function useCreateAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (audit: {
      investment_id: string;
      audit_year: number;
      auditor_name?: string | null;
      auditor_firm?: string | null;
      audit_type: string;
      outcome?: string | null;
      success_rate_pct?: number | null;
      notes?: string | null;
      report_url?: string | null;
    }) => {
      const { data, error } = await supabase
        .from('investment_audits')
        .insert(audit as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return castRow<InvestmentAudit>(data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-audits', variables.investment_id] });
    },
  });
}

export function useDeleteAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, investmentId }: { id: string; investmentId: string }) => {
      const { error } = await supabase.from('investment_audits').delete().eq('id', id);
      if (error) throw error;
      return investmentId;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investment-audits', variables.investmentId] });
    },
  });
}

// ============================================
// FILE UPLOAD
// ============================================

export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ file, investmentId }: { file: File; investmentId: string }) => {
      const ext = file.name.split('.').pop();
      const path = `investments/${investmentId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(path);

      return {
        url: urlData.publicUrl,
        path,
        fileName: file.name,
        fileSize: file.size,
      };
    },
  });
}
