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
    const { originZip, destinationZip, weight, length, width, height } = await req.json();

    console.log('Calculating freight:', { originZip, destinationZip, weight });

    // TODO: Integrar com API real dos Correios
    // Por enquanto, simula cálculo baseado em distância e peso
    const basePrice = 15.00;
    const weightFactor = parseFloat(weight) * 2.5;
    const dimensionFactor = (length && width && height) 
      ? (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 6000
      : 0;
    
    const calculatedPrice = basePrice + weightFactor + dimensionFactor;
    const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3-7 dias

    const result = {
      service_type: 'SEDEX',
      price: calculatedPrice.toFixed(2),
      delivery_days: deliveryDays,
      success: true
    };

    // Salvar no histórico
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { error: insertError } = await supabaseClient
      .from('shipping_calculations')
      .insert({
        origin_zip: originZip,
        destination_zip: destinationZip,
        weight: parseFloat(weight),
        length: length ? parseFloat(length) : null,
        width: width ? parseFloat(width) : null,
        height: height ? parseFloat(height) : null,
        service_type: result.service_type,
        price: parseFloat(result.price),
        delivery_days: result.delivery_days,
        response_data: result
      });

    if (insertError) {
      console.error('Error saving to history:', insertError);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in calculate-freight:', error);
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
