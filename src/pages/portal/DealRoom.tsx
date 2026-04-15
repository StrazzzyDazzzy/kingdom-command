import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useInvestment,
  useInvestmentDocuments,
  useInvestmentVideos,
  useInvestmentLinks,
  useInvestmentAudits,
  useIrsCodes,
} from '@/hooks/useInvestments';
import { useAuth } from '@/lib/auth';
import { openWatermarkedPdf } from '@/lib/pdf/watermark';
import { generateAdvisorPacket } from '@/lib/pdf/packetGenerator';
import { logActivity } from '@/lib/activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Disclaimer } from '@/components/shared/Disclaimer';
import { ScenarioCalculator } from '@/components/investments/ScenarioCalculator';
import { DisclosureGate } from '@/components/investments/DisclosureGate';
import { InvestmentChat } from '@/components/ai/InvestmentChat';
import { NlScenarioGenerator } from '@/components/ai/NlScenarioGenerator';
import {
  ArrowLeft,
  Building2,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Shield,
  AlertTriangle,
  ExternalLink,
  Play,
  Download,
  BookOpen,
  Scale,
  CheckCircle,
  XCircle,
  Send,
  Loader2,
  Pencil,
} from 'lucide-react';
import { CATEGORY_LABELS, STATUS_LABELS, DOC_TYPE_LABELS } from '@/types/dataroom';

export default function DealRoom() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);

  const { data: investment, isLoading } = useInvestment(slug ?? '');
  const { data: documents } = useInvestmentDocuments(investment?.id ?? '');
  const { data: videos } = useInvestmentVideos(investment?.id ?? '');
  const { data: links } = useInvestmentLinks(investment?.id ?? '');
  const { data: audits } = useInvestmentAudits(investment?.id ?? '');
  const { data: irsCodes } = useIrsCodes();

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
        <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-lg font-semibold">Investment Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1">This investment may have been removed or archived.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/portal')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Investments
        </Button>
      </div>
    );
  }

  // Disclosure gate for non-admin users
  if (!disclosureAccepted && profile?.role !== 'admin') {
    return (
      <DisclosureGate
        investmentTitle={investment.title}
        onAccept={() => setDisclosureAccepted(true)}
        onDecline={() => navigate('/portal')}
      />
    );
  }

  const outcomeIcon = (outcome: string | null) => {
    if (outcome === 'sustained' || outcome === 'no_change') return <CheckCircle className="h-4 w-4 text-teal" />;
    if (outcome === 'disallowed') return <XCircle className="h-4 w-4 text-destructive" />;
    return <AlertTriangle className="h-4 w-4 text-gold" />;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/portal')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Investments
      </Button>

      {/* Hero Section */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{CATEGORY_LABELS[investment.category]}</Badge>
              <Badge variant={investment.status === 'active' ? 'default' : 'outline'}>
                {STATUS_LABELS[investment.status]}
              </Badge>
              {investment.is_featured && (
                <Badge className="bg-gold/10 text-gold border-gold/20">
                  <Star className="mr-1 h-3 w-3 fill-gold" /> Featured
                </Badge>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground">
              {investment.title}
            </h1>

            {investment.short_description && (
              <p className="text-base text-muted-foreground max-w-2xl">
                {investment.short_description}
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            {profile?.role === 'admin' && (
              <Link to={`/portal/investments/${slug}/edit`}>
                <Button variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}
            <Button onClick={() => {
              if (investment) {
                generateAdvisorPacket({
                  investment,
                  documents: documents ?? [],
                  audits: audits ?? [],
                  irsCodes: irsCodes ?? [],
                  clientName: profile?.full_name ?? 'Client',
                });
              }
            }}>
              <Send className="mr-2 h-4 w-4" />
              Send to CPA/Attorney
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {investment.minimum_investment && (
            <div className="rounded-lg bg-background/50 border border-border/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Minimum Investment</span>
              </div>
              <p className="text-xl font-mono font-bold text-foreground">
                ${investment.minimum_investment.toLocaleString()}
              </p>
            </div>
          )}
          {investment.target_return && (
            <div className="rounded-lg bg-background/50 border border-border/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4 text-teal" />
                <span className="text-xs font-medium uppercase tracking-wider">Target Return</span>
              </div>
              <p className="text-xl font-mono font-bold text-foreground">{investment.target_return}</p>
            </div>
          )}
          {investment.hold_period && (
            <div className="rounded-lg bg-background/50 border border-border/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Hold Period</span>
              </div>
              <p className="text-xl font-mono font-bold text-foreground">{investment.hold_period}</p>
            </div>
          )}
          {investment.irs_codes && investment.irs_codes.length > 0 && (
            <div className="rounded-lg bg-background/50 border border-border/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">IRS Codes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {investment.irs_codes.map((code) => (
                  <Badge key={code} variant="outline" className="text-xs border-teal/30 text-teal">
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tax Strategy Badges */}
        {(investment.has_1031 || investment.has_qoz || investment.has_cost_seg || investment.has_179d || investment.has_section_45 || investment.has_material_participation) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {investment.has_1031 && <Badge className="bg-teal/10 text-teal border-teal/20">1031 Exchange Eligible</Badge>}
            {investment.has_qoz && <Badge className="bg-teal/10 text-teal border-teal/20">Qualified Opportunity Zone</Badge>}
            {investment.has_cost_seg && <Badge className="bg-teal/10 text-teal border-teal/20">Cost Segregation</Badge>}
            {investment.has_179d && <Badge className="bg-teal/10 text-teal border-teal/20">Section 179D</Badge>}
            {investment.has_section_45 && <Badge className="bg-teal/10 text-teal border-teal/20">Section 45 PTC</Badge>}
            {investment.has_material_participation && (
              <Badge className="bg-gold/10 text-gold border-gold/20">
                <AlertTriangle className="mr-1 h-3 w-3" /> Material Participation Required
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Material Participation Warning */}
      {investment.has_material_participation && investment.material_participation_notes && (
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Scale className="mt-0.5 h-5 w-5 text-gold shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-1">Material Participation Requirements</p>
              <p className="text-sm text-muted-foreground">{investment.material_participation_notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internal Audit Disclosure */}
      {investment.internal_audit_notes && (
        <Card className="border-teal/30 bg-teal/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Shield className="mt-0.5 h-5 w-5 text-teal shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-1">Internal Audit Review</p>
              <p className="text-sm text-muted-foreground">
                Our auditors have reviewed this investment. {investment.internal_audit_notes}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audits">Audit History</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="ai-chat">AI Q&A</TabsTrigger>
          <TabsTrigger value="ai-scenario">AI Scenario</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          {investment.long_description && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Investment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                  {investment.long_description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links */}
          {links && links.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Resources & Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border/50 p-3 text-sm hover:bg-muted/30 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{link.label}</span>
                      {link.link_type && (
                        <Badge variant="outline" className="ml-auto text-xs">{link.link_type}</Badge>
                      )}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Disclaimer variant="investment" />
          <Disclaimer variant="irs" />
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          {documents && documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <Card key={doc.id} className="border-border/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.file_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{DOC_TYPE_LABELS[doc.doc_type]}</Badge>
                        {doc.page_count && <span>{doc.page_count} pages</span>}
                        {doc.file_size && <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {doc.file_name.toLowerCase().endsWith('.pdf') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            openWatermarkedPdf(doc.file_url, profile?.full_name ?? 'Client');
                            logActivity({ action: 'viewed', entityType: 'document', entityId: doc.id, entityName: doc.file_name });
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="space-y-4">
          {videos && videos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {videos.map((video) => (
                <Card key={video.id} className="border-border/50 overflow-hidden">
                  <div className="aspect-video bg-muted/30 flex items-center justify-center">
                    <iframe
                      src={video.embed_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={video.title}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mt-1">{video.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Play className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No videos available yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Audit History */}
        <TabsContent value="audits" className="space-y-4">
          <Disclaimer variant="audit" />
          {audits && audits.length > 0 ? (
            <div className="space-y-3">
              {audits.map((audit) => (
                <Card key={audit.id} className="border-border/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    {outcomeIcon(audit.outcome)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{audit.audit_year} {audit.audit_type.toUpperCase()} Audit</p>
                        <Badge variant="outline" className="text-xs capitalize">{audit.outcome ?? 'Pending'}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {audit.auditor_firm && <span>{audit.auditor_firm}</span>}
                        {audit.success_rate_pct != null && (
                          <span className="ml-2 font-mono">Success Rate: {audit.success_rate_pct}%</span>
                        )}
                      </div>
                      {audit.notes && <p className="text-xs text-muted-foreground mt-1">{audit.notes}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No audit records available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Scenario Calculator */}
        <TabsContent value="scenarios" className="space-y-4">
          <ScenarioCalculator investment={investment} />
        </TabsContent>

        {/* AI Chat */}
        <TabsContent value="ai-chat" className="space-y-4">
          <InvestmentChat investment={investment} documents={documents ?? []} />
        </TabsContent>

        {/* AI Scenario Generator */}
        <TabsContent value="ai-scenario" className="space-y-4">
          <NlScenarioGenerator investment={investment} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
