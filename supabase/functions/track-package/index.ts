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
    const { trackingCode } = await req.json();

    console.log('Tracking package:', trackingCode);

    // TODO: Integrar com API real dos Correios
    // Por enquanto, simula dados de rastreamento
    const statuses = [
      'Objeto postado',
      'Em trânsito',
      'Saiu para entrega',
      'Entregue ao destinatário',
      'Aguardando retirada'
    ];

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const lastUpdate = new Date();
    lastUpdate.setHours(lastUpdate.getHours() - Math.floor(Math.random() * 48));

    const result = {
      tracking_code: trackingCode,
      status: randomStatus,
      last_update: lastUpdate.toISOString(),
      events: [
        {
          date: lastUpdate.toISOString(),
          location: 'Centro de Distribuição - São Paulo/SP',
          description: randomStatus
        }
      ],
      success: true
    };

    // Salvar no histórico
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { error: insertError } = await supabaseClient
      .from('tracking_queries')
      .insert({
        tracking_code: trackingCode,
        status: randomStatus,
        last_update_date: lastUpdate.toISOString(),
        response_data: result
      });

    if (insertError) {
      console.error('Error saving to history:', insertError);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in track-package:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, success: false }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
