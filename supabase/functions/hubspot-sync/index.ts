import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HUBSPOT_API_KEY = Deno.env.get('HUBSPOT_API_KEY');
    if (!HUBSPOT_API_KEY) {
      throw new Error('HUBSPOT_API_KEY is not configured. Add it in Cloud secrets.');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch deals from HubSpot
    const dealsRes = await fetch(
      'https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,dealstage,amount,closedate,pipeline,hubspot_owner_id,days_to_close,createdate,hs_lastmodifieddate',
      {
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!dealsRes.ok) {
      const errText = await dealsRes.text();
      throw new Error(`HubSpot API error [${dealsRes.status}]: ${errText}`);
    }

    const dealsData = await dealsRes.json();
    const deals = dealsData.results || [];

    // Upsert deals into database
    for (const deal of deals) {
      const props = deal.properties || {};
      const { error } = await supabase.from('hubspot_deals').upsert({
        hubspot_deal_id: deal.id,
        deal_name: props.dealname || 'Untitled',
        stage: props.dealstage || '',
        amount: parseFloat(props.amount) || null,
        close_date: props.closedate || null,
        pipeline: props.pipeline || 'default',
        owner_name: props.hubspot_owner_id || '',
        days_in_stage: parseInt(props.days_to_close) || null,
        created_date: props.createdate || null,
        last_modified: props.hs_lastmodifieddate || null,
        properties: props,
        synced_at: new Date().toISOString(),
      }, { onConflict: 'hubspot_deal_id' });

      if (error) console.error('Upsert error for deal', deal.id, error);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      synced: deals.length,
      message: `Synced ${deals.length} deals from HubSpot` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('HubSpot sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
