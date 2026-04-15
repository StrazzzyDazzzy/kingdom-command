-- ============================================
-- Kingdom Investors - Production Hardening
-- Storage, auto-logging, onboarding gate, notifications
-- ============================================

-- ============================================
-- STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies — admins can upload, all authenticated can read
CREATE POLICY "Admins upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins update documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users read documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid() IS NOT NULL
  );

-- ============================================
-- FIRST-USER-IS-ADMIN BOOTSTRAP
-- Replaces the default client role for the very first account
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  assigned_role TEXT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  assigned_role := CASE WHEN user_count = 0 THEN 'admin' ELSE 'client' END;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    assigned_role
  );

  -- Create welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to Kingdom Investors',
    CASE
      WHEN assigned_role = 'admin' THEN 'Your admin account is ready. You have full platform access.'
      ELSE 'Complete your investor onboarding to access the deal room.'
    END,
    'info'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- NOTIFICATION TRIGGERS
-- ============================================

-- Notify client when K-1 is distributed
CREATE OR REPLACE FUNCTION public.notify_k1_distributed()
RETURNS TRIGGER AS $$
DECLARE
  inv_title TEXT;
BEGIN
  IF NEW.status = 'distributed' AND (OLD.status IS NULL OR OLD.status != 'distributed') THEN
    SELECT title INTO inv_title FROM public.investments WHERE id = NEW.investment_id;

    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      NEW.client_id,
      'K-1 Document Available',
      'Your ' || NEW.tax_year || ' K-1 for ' || COALESCE(inv_title, 'your investment') || ' is now available.',
      'k1',
      '/portal/portfolio'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_k1 ON public.k1_documents;
CREATE TRIGGER trg_notify_k1
  AFTER INSERT OR UPDATE OF status ON public.k1_documents
  FOR EACH ROW EXECUTE FUNCTION public.notify_k1_distributed();

-- Notify affiliate when referral status changes to converted
CREATE OR REPLACE FUNCTION public.notify_referral_converted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'converted' AND (OLD.status IS NULL OR OLD.status != 'converted') THEN
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      NEW.affiliate_id,
      'Referral Converted',
      NEW.referred_name || ' has converted. Commission details will be updated shortly.',
      'success',
      '/portal/affiliate'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_referral ON public.affiliate_referrals;
CREATE TRIGGER trg_notify_referral
  AFTER UPDATE OF status ON public.affiliate_referrals
  FOR EACH ROW EXECUTE FUNCTION public.notify_referral_converted();

-- ============================================
-- AUTO-LOG ACTIVITY VIA TRIGGERS (investments, documents, k1s)
-- ============================================

CREATE OR REPLACE FUNCTION public.log_investment_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name)
    VALUES (auth.uid(), 'created', 'investment', NEW.id, NEW.title);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name)
    VALUES (auth.uid(), 'updated', 'investment', NEW.id, NEW.title);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name)
    VALUES (auth.uid(), 'deleted', 'investment', OLD.id, OLD.title);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_investments ON public.investments;
CREATE TRIGGER trg_log_investments
  AFTER INSERT OR UPDATE OR DELETE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.log_investment_activity();

CREATE OR REPLACE FUNCTION public.log_document_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name)
    VALUES (auth.uid(), 'created', 'document', NEW.id, NEW.file_name);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name)
    VALUES (auth.uid(), 'deleted', 'document', OLD.id, OLD.file_name);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_documents ON public.investment_documents;
CREATE TRIGGER trg_log_documents
  AFTER INSERT OR DELETE ON public.investment_documents
  FOR EACH ROW EXECUTE FUNCTION public.log_document_activity();

CREATE OR REPLACE FUNCTION public.log_k1_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (auth.uid(), 'created', 'k1', NEW.id, jsonb_build_object('tax_year', NEW.tax_year, 'status', NEW.status));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (auth.uid(),
      CASE WHEN NEW.status = 'distributed' THEN 'distributed' ELSE 'updated' END,
      'k1', NEW.id,
      jsonb_build_object('tax_year', NEW.tax_year, 'from', OLD.status, 'to', NEW.status));
    RETURN NEW;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_k1 ON public.k1_documents;
CREATE TRIGGER trg_log_k1
  AFTER INSERT OR UPDATE ON public.k1_documents
  FOR EACH ROW EXECUTE FUNCTION public.log_k1_activity();

CREATE OR REPLACE FUNCTION public.log_compliance_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name)
    VALUES (auth.uid(), 'created', 'compliance', NEW.id, NEW.title);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name, metadata)
    VALUES (auth.uid(), 'updated', 'compliance', NEW.id, NEW.title,
      jsonb_build_object('from', OLD.status, 'to', NEW.status));
    RETURN NEW;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_compliance ON public.compliance_items;
CREATE TRIGGER trg_log_compliance
  AFTER INSERT OR UPDATE ON public.compliance_items
  FOR EACH ROW EXECUTE FUNCTION public.log_compliance_activity();
