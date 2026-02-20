import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();

    // Determine source: Stripe webhook or generic
    let paymentData;

    if (body.type && body.type.startsWith('checkout.session') || body.type === 'payment_intent.succeeded') {
      // Stripe webhook format
      const obj = body.data?.object || {};
      paymentData = {
        source: 'stripe',
        external_id: obj.id || obj.payment_intent,
        amount: (obj.amount_total || obj.amount || 0) / 100,
        currency: obj.currency || 'usd',
        description: obj.description || obj.metadata?.description || '',
        customer_email: obj.customer_email || obj.customer_details?.email || '',
        customer_name: obj.customer_details?.name || '',
        business_unit: obj.metadata?.business_unit || null,
        metadata: obj.metadata || {},
        payment_date: new Date().toISOString(),
      };
    } else {
      // Generic webhook format
      paymentData = {
        source: body.source || 'manual',
        external_id: body.external_id || body.id || null,
        amount: parseFloat(body.amount) || 0,
        currency: body.currency || 'usd',
        description: body.description || '',
        customer_email: body.customer_email || body.email || '',
        customer_name: body.customer_name || body.name || '',
        business_unit: body.business_unit || null,
        metadata: body.metadata || {},
        payment_date: body.payment_date || new Date().toISOString(),
      };
    }

    const { error } = await supabase.from('payments').insert(paymentData);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
