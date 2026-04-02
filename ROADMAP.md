# Kingdom Investors — Data Room Platform Roadmap

## Phase 1: Foundation (Current)

### Completed
- [x] Database schema: 13 tables with full RLS policies (profiles, investments, documents, videos, links, scenarios, IRS codes, audits, affiliate resources, commissions, deal access, AI conversations)
- [x] Supabase migration with auto-profile creation trigger and IRS code seed data
- [x] Brand theme: Deep Navy (#0A1628), Warm Gold (#C9A84C), Slate (#1E2D40), Muted Teal (#2A7B6F)
- [x] Typography: Playfair Display (headlines), DM Sans (body), JetBrains Mono (data)
- [x] Auth system: Supabase Auth with role-based access (admin/client/affiliate)
- [x] AuthProvider context with signIn, signUp, signOut, profile management
- [x] ProtectedRoute component with role-based access control
- [x] Portal layout with responsive sidebar navigation (desktop + mobile)
- [x] Admin dashboard: Investment CRUD (create, list, filter, delete)
- [x] Client investment listing page with category/status filters and search
- [x] Investment deal room page with hero, metrics, tabs (overview, documents, videos, audits, scenarios)
- [x] Disclosure gate: Client must acknowledge disclosures before entering deal room
- [x] Hypothetical scenario calculator with tax savings estimation
- [x] Compliance disclaimers: investment, AI, audit, IRS, affiliate variants
- [x] IRS code library seeded with 12 common tax code references
- [x] Material participation detection display
- [x] Internal audit disclosure banner
- [x] Tax strategy badge display (1031, QOZ, Cost Seg, 179D, Section 45)

### Remaining Phase 1
- [ ] Admin investment edit form (full field editing)
- [ ] File upload system: drag-drop PDF upload to Supabase Storage
- [ ] PDF text extraction on upload
- [ ] PDF watermarking with client name
- [ ] IRS codes admin management UI
- [ ] Audit record admin CRUD
- [ ] Document admin CRUD (upload, categorize, visibility controls)
- [ ] Video embed admin CRUD
- [ ] Link management admin UI
- [ ] "Send to CPA/Attorney" packet generator (branded PDF)

## Phase 2: AI Intelligence Layer
- [ ] PDF ingestion pipeline: upload → extract → chunk → embed with pgvector
- [ ] Per-investment AI chat (Claude API, grounded in investment docs)
- [ ] IRS code auto-tagging from document analysis
- [ ] Material participation detector (AI reads PPM)
- [ ] Natural language scenario generator
- [ ] Cross-investment comparison tool
- [ ] "Send to Advisor" AI-generated branded PDF packet

## Phase 3: Affiliate / Growth Partner Hub
- [ ] Separate affiliate portal with curated investment access
- [ ] Commission rate sheets (tiered by affiliate level)
- [ ] Training resources: what to say / what NOT to say per investment
- [ ] Fact sheets and one-pagers (downloadable)
- [ ] Video training library
- [ ] Objection handling guides
- [ ] Affiliate onboarding flow with compliance acknowledgment
- [ ] Admin affiliate resource management

## Phase 4: Client Dashboard & Reporting
- [ ] Client portfolio tracker
- [ ] Document access log (what they opened, when)
- [ ] Enhanced "Send to CPA/Attorney" packet generator
- [ ] Notification system (new investments, document updates)
- [ ] Admin client activity dashboard

## Phase 5: Scale & Polish
- [ ] Semantic search across all investments and documents (pgvector)
- [ ] Admin analytics dashboard
- [ ] Affiliate performance tracking
- [ ] White-label mode
- [ ] API layer for LeepAI voice agents
- [ ] Mobile optimization pass
- [ ] Performance audit and optimization
