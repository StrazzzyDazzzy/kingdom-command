import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { extractTextFromPdf, saveExtractedText, estimatePageCount } from '@/lib/pdf/extract';
import {
  useInvestment,
  useUpdateInvestment,
  useInvestmentDocuments,
  useInvestmentVideos,
  useInvestmentLinks,
  useInvestmentAudits,
  useCreateDocument,
  useDeleteDocument,
  useCreateVideo,
  useDeleteVideo,
  useCreateLink,
  useDeleteLink,
  useCreateAudit,
  useDeleteAudit,
  useUploadFile,
} from '@/hooks/useInvestments';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  Video,
  Link2,
  Shield,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { CATEGORY_LABELS, STATUS_LABELS, DOC_TYPE_LABELS } from '@/types/dataroom';
import type { InvestmentCategory, InvestmentStatus, DocType, Investment } from '@/types/dataroom';

export default function InvestmentEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const { data: investment, isLoading } = useInvestment(slug ?? '');
  const updateInvestment = useUpdateInvestment();

  // Sub-resource queries
  const { data: documents } = useInvestmentDocuments(investment?.id ?? '');
  const { data: videos } = useInvestmentVideos(investment?.id ?? '');
  const { data: links } = useInvestmentLinks(investment?.id ?? '');
  const { data: audits } = useInvestmentAudits(investment?.id ?? '');

  // Form state
  const [form, setForm] = useState<Partial<Investment>>({});
  const [saved, setSaved] = useState(false);
  const [irsCodes, setIrsCodes] = useState('');

  useEffect(() => {
    if (investment) {
      setForm(investment);
      setIrsCodes((investment.irs_codes ?? []).join(', '));
    }
  }, [investment]);

  const handleSave = async () => {
    if (!investment) return;
    const codes = irsCodes.split(',').map(s => s.trim()).filter(Boolean);
    await updateInvestment.mutateAsync({
      id: investment.id,
      title: form.title,
      category: form.category,
      status: form.status,
      short_description: form.short_description,
      long_description: form.long_description,
      minimum_investment: form.minimum_investment,
      target_return: form.target_return,
      hold_period: form.hold_period,
      irs_codes: codes,
      has_1031: form.has_1031,
      has_qoz: form.has_qoz,
      has_cost_seg: form.has_cost_seg,
      has_179d: form.has_179d,
      has_section_45: form.has_section_45,
      has_material_participation: form.has_material_participation,
      material_participation_notes: form.material_participation_notes,
      internal_audit_notes: form.internal_audit_notes,
      compliance_notes: form.compliance_notes,
      is_featured: form.is_featured,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = <K extends keyof Investment>(key: K, value: Investment[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  if (profile?.role !== 'admin') {
    return <div className="p-8 text-center text-muted-foreground">Access denied.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Investment not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/portal')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/portal')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{investment.title}</h1>
            <p className="text-sm text-muted-foreground">Edit investment details and manage resources</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={updateInvestment.isPending}>
          {updateInvestment.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="mr-2 h-4 w-4 text-teal" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({videos?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="links">Links ({links?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="audits">Audits ({audits?.length ?? 0})</TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* DETAILS TAB */}
        {/* ============================================ */}
        <TabsContent value="details" className="space-y-6">
          {/* Basic Info */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title ?? ''} onChange={e => updateField('title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug ?? ''} disabled className="opacity-60" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category ?? ''} onValueChange={v => updateField('category', v as InvestmentCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status ?? ''} onValueChange={v => updateField('status', v as InvestmentStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_featured ?? false} onCheckedChange={v => updateField('is_featured', v)} id="featured" />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea value={form.short_description ?? ''} onChange={e => updateField('short_description', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Long Description</Label>
                <Textarea value={form.long_description ?? ''} onChange={e => updateField('long_description', e.target.value)} rows={6} placeholder="Detailed investment overview..." />
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Financial Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Minimum Investment ($)</Label>
                  <Input type="number" value={form.minimum_investment ?? ''} onChange={e => updateField('minimum_investment', e.target.value ? parseFloat(e.target.value) : null)} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Target Return</Label>
                  <Input value={form.target_return ?? ''} onChange={e => updateField('target_return', e.target.value || null)} placeholder="8-12%" />
                </div>
                <div className="space-y-2">
                  <Label>Hold Period</Label>
                  <Input value={form.hold_period ?? ''} onChange={e => updateField('hold_period', e.target.value || null)} placeholder="5-7 years" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Strategy Flags */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Tax Strategy Features</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {([
                  ['has_1031', '1031 Exchange'],
                  ['has_qoz', 'Opp. Zone (QOZ)'],
                  ['has_cost_seg', 'Cost Segregation'],
                  ['has_179d', 'Section 179D'],
                  ['has_section_45', 'Section 45 PTC'],
                  ['has_material_participation', 'Material Participation'],
                ] as const).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Switch
                      checked={(form[key] as boolean) ?? false}
                      onCheckedChange={v => updateField(key, v)}
                      id={key}
                    />
                    <Label htmlFor={key} className="text-xs">{label}</Label>
                  </div>
                ))}
              </div>
              {form.has_material_participation && (
                <div className="space-y-2">
                  <Label>Material Participation Notes</Label>
                  <Textarea value={form.material_participation_notes ?? ''} onChange={e => updateField('material_participation_notes', e.target.value || null)} rows={2} placeholder="Describe material participation requirements..." />
                </div>
              )}
              <div className="space-y-2">
                <Label>IRS Codes (comma-separated)</Label>
                <Input value={irsCodes} onChange={e => setIrsCodes(e.target.value)} placeholder="Section 1031, Section 170(h), Section 179D" />
              </div>
            </CardContent>
          </Card>

          {/* Audit & Compliance */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Audit & Compliance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Internal Audit Notes</Label>
                <Textarea value={form.internal_audit_notes ?? ''} onChange={e => updateField('internal_audit_notes', e.target.value || null)} rows={2} placeholder="Notes about internal audit review..." />
              </div>
              <div className="space-y-2">
                <Label>Compliance Notes</Label>
                <Textarea value={form.compliance_notes ?? ''} onChange={e => updateField('compliance_notes', e.target.value || null)} rows={2} placeholder="Additional compliance information..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* DOCUMENTS TAB */}
        {/* ============================================ */}
        <TabsContent value="documents" className="space-y-4">
          <DocumentManager investmentId={investment.id} documents={documents ?? []} />
        </TabsContent>

        {/* ============================================ */}
        {/* VIDEOS TAB */}
        {/* ============================================ */}
        <TabsContent value="videos" className="space-y-4">
          <VideoManager investmentId={investment.id} videos={videos ?? []} />
        </TabsContent>

        {/* ============================================ */}
        {/* LINKS TAB */}
        {/* ============================================ */}
        <TabsContent value="links" className="space-y-4">
          <LinkManager investmentId={investment.id} links={links ?? []} />
        </TabsContent>

        {/* ============================================ */}
        {/* AUDITS TAB */}
        {/* ============================================ */}
        <TabsContent value="audits" className="space-y-4">
          <AuditManager investmentId={investment.id} audits={audits ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// DOCUMENT MANAGER
// ============================================

import type { InvestmentDocument, InvestmentVideo, InvestmentLink, InvestmentAudit } from '@/types/dataroom';

function DocumentManager({ investmentId, documents }: { investmentId: string; documents: InvestmentDocument[] }) {
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const uploadFile = useUploadFile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [docType, setDocType] = useState<DocType>('ppm');
  const [isClientVisible, setIsClientVisible] = useState(true);
  const [isAffiliateVisible, setIsAffiliateVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const result = await uploadFile.mutateAsync({ file: selectedFile, investmentId });

      // Estimate page count for PDFs
      let pageCount: number | null = null;
      if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
        pageCount = await estimatePageCount(selectedFile);
      }

      // Create document record
      const docResult = await createDoc.mutateAsync({
        investment_id: investmentId,
        doc_type: docType,
        file_name: result.fileName,
        file_url: result.url,
        file_size: result.fileSize,
        page_count: pageCount,
        is_client_visible: isClientVisible,
        is_affiliate_visible: isAffiliateVisible,
      });

      // Extract text from PDFs in background (non-blocking)
      if (selectedFile.name.toLowerCase().endsWith('.pdf') && docResult?.id) {
        extractTextFromPdf(selectedFile).then(text => {
          saveExtractedText(docResult.id, text).catch(() => {
            // Text extraction is best-effort; don't block the UI
          });
        }).catch(() => {});
      }

      setSelectedFile(null);
      setDialogOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Documents</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Upload Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                {selectedFile ? (
                  <p className="text-sm font-medium text-foreground">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOCX, XLSX up to 50MB</p>
                  </>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.xls,.pptx,.ppt,.txt"
                  className="hidden"
                  onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={docType} onValueChange={v => setDocType(v as DocType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={isClientVisible} onCheckedChange={setIsClientVisible} id="doc-client" />
                  <Label htmlFor="doc-client" className="text-sm">Client Visible</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={isAffiliateVisible} onCheckedChange={setIsAffiliateVisible} id="doc-affiliate" />
                  <Label htmlFor="doc-affiliate" className="text-sm">Affiliate Visible</Label>
                </div>
              </div>
              <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => (
            <Card key={doc.id} className="border-border/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{doc.file_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Badge variant="outline" className="text-xs">{DOC_TYPE_LABELS[doc.doc_type]}</Badge>
                    {doc.file_size && <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>}
                    {doc.is_client_visible && <Badge variant="secondary" className="text-xs">Client</Badge>}
                    {doc.is_affiliate_visible && <Badge variant="secondary" className="text-xs">Affiliate</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteDoc.mutate({ id: doc.id, investmentId })}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================
// VIDEO MANAGER
// ============================================

function VideoManager({ investmentId, videos }: { investmentId: string; videos: InvestmentVideo[] }) {
  const createVideo = useCreateVideo();
  const deleteVideo = useDeleteVideo();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [description, setDescription] = useState('');
  const [affiliateVisible, setAffiliateVisible] = useState(true);

  const handleCreate = async () => {
    if (!title.trim() || !embedUrl.trim()) return;
    await createVideo.mutateAsync({
      investment_id: investmentId,
      title,
      embed_url: embedUrl,
      platform,
      description: description || null,
      is_affiliate_visible: affiliateVisible,
      display_order: videos.length,
    });
    setTitle('');
    setEmbedUrl('');
    setDescription('');
    setDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Videos</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Video</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Video</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Investment Walkthrough" />
              </div>
              <div className="space-y-2">
                <Label>Embed URL</Label>
                <Input value={embedUrl} onChange={e => setEmbedUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="loom">Loom</SelectItem>
                      <SelectItem value="wistia">Wistia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-2">
                    <Switch checked={affiliateVisible} onCheckedChange={setAffiliateVisible} id="vid-affiliate" />
                    <Label htmlFor="vid-affiliate" className="text-sm">Affiliate Visible</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
              </div>
              <Button onClick={handleCreate} disabled={createVideo.isPending || !title.trim() || !embedUrl.trim()} className="w-full">
                {createVideo.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Video
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {videos.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Video className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No videos added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {videos.map(video => (
            <Card key={video.id} className="border-border/50 overflow-hidden">
              <div className="aspect-video bg-muted/30">
                <iframe src={video.embed_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={video.title} />
              </div>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{video.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Badge variant="outline" className="text-xs capitalize">{video.platform}</Badge>
                    {video.is_affiliate_visible && <Badge variant="secondary" className="text-xs">Affiliate</Badge>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteVideo.mutate({ id: video.id, investmentId })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================
// LINK MANAGER
// ============================================

const LINK_TYPE_LABELS: Record<string, string> = {
  prospectus: 'Prospectus',
  article: 'Article',
  irs_reference: 'IRS Reference',
  news: 'News',
  regulatory: 'Regulatory',
  sponsor_website: 'Sponsor Website',
  other: 'Other',
};

function LinkManager({ investmentId, links }: { investmentId: string; links: InvestmentLink[] }) {
  const createLink = useCreateLink();
  const deleteLink = useDeleteLink();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [linkType, setLinkType] = useState('other');
  const [isPublic, setIsPublic] = useState(false);

  const handleCreate = async () => {
    if (!label.trim() || !url.trim()) return;
    await createLink.mutateAsync({
      investment_id: investmentId,
      label,
      url,
      link_type: linkType,
      is_public: isPublic,
    });
    setLabel('');
    setUrl('');
    setDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Links & Resources</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Link</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="IRS Revenue Ruling 2023-1" />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={linkType} onValueChange={setLinkType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(LINK_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-2">
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} id="link-public" />
                    <Label htmlFor="link-public" className="text-sm">Public</Label>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreate} disabled={createLink.isPending || !label.trim() || !url.trim()} className="w-full">
                {createLink.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Link2 className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No links added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {links.map(link => (
            <Card key={link.id} className="border-border/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{link.label}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {link.link_type && <Badge variant="outline" className="text-xs">{LINK_TYPE_LABELS[link.link_type] ?? link.link_type}</Badge>}
                    {link.is_public && <Badge variant="secondary" className="text-xs">Public</Badge>}
                    <span className="truncate max-w-[200px]">{link.url}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteLink.mutate({ id: link.id, investmentId })}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================
// AUDIT MANAGER
// ============================================

const AUDIT_TYPE_LABELS: Record<string, string> = { irs: 'IRS', internal: 'Internal', third_party: 'Third Party' };
const OUTCOME_LABELS: Record<string, string> = {
  sustained: 'Sustained',
  partially_sustained: 'Partially Sustained',
  disallowed: 'Disallowed',
  pending: 'Pending',
  no_change: 'No Change',
};

function AuditManager({ investmentId, audits }: { investmentId: string; audits: InvestmentAudit[] }) {
  const createAudit = useCreateAudit();
  const deleteAudit = useDeleteAudit();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [auditYear, setAuditYear] = useState(new Date().getFullYear().toString());
  const [auditorName, setAuditorName] = useState('');
  const [auditorFirm, setAuditorFirm] = useState('');
  const [auditType, setAuditType] = useState('internal');
  const [outcome, setOutcome] = useState('sustained');
  const [successRate, setSuccessRate] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreate = async () => {
    await createAudit.mutateAsync({
      investment_id: investmentId,
      audit_year: parseInt(auditYear),
      auditor_name: auditorName || null,
      auditor_firm: auditorFirm || null,
      audit_type: auditType,
      outcome,
      success_rate_pct: successRate ? parseFloat(successRate) : null,
      notes: notes || null,
    });
    setAuditorName('');
    setAuditorFirm('');
    setNotes('');
    setDialogOpen(false);
  };

  const outcomeIcon = (o: string | null) => {
    if (o === 'sustained' || o === 'no_change') return <CheckCircle className="h-4 w-4 text-teal" />;
    if (o === 'disallowed') return <XCircle className="h-4 w-4 text-destructive" />;
    return <AlertTriangle className="h-4 w-4 text-gold" />;
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Audit Records</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Audit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Audit Record</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input type="number" value={auditYear} onChange={e => setAuditYear(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={auditType} onValueChange={setAuditType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(AUDIT_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Auditor Name</Label>
                  <Input value={auditorName} onChange={e => setAuditorName(e.target.value)} placeholder="Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label>Firm</Label>
                  <Input value={auditorFirm} onChange={e => setAuditorFirm(e.target.value)} placeholder="Deloitte" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Outcome</Label>
                  <Select value={outcome} onValueChange={setOutcome}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(OUTCOME_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Success Rate (%)</Label>
                  <Input type="number" value={successRate} onChange={e => setSuccessRate(e.target.value)} placeholder="95" min="0" max="100" className="font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Audit details..." />
              </div>
              <Button onClick={handleCreate} disabled={createAudit.isPending} className="w-full">
                {createAudit.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Audit Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {audits.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No audit records yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {audits.map(audit => (
            <Card key={audit.id} className="border-border/50">
              <CardContent className="flex items-center gap-4 p-4">
                {outcomeIcon(audit.outcome)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">
                      {audit.audit_year} {AUDIT_TYPE_LABELS[audit.audit_type] ?? audit.audit_type} Audit
                    </p>
                    <Badge variant="outline" className="text-xs capitalize">{OUTCOME_LABELS[audit.outcome ?? ''] ?? audit.outcome ?? 'Pending'}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {audit.auditor_firm && <span>{audit.auditor_firm}</span>}
                    {audit.auditor_name && <span> — {audit.auditor_name}</span>}
                    {audit.success_rate_pct != null && <span className="ml-2 font-mono">Success: {audit.success_rate_pct}%</span>}
                  </div>
                  {audit.notes && <p className="text-xs text-muted-foreground mt-1">{audit.notes}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteAudit.mutate({ id: audit.id, investmentId })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
