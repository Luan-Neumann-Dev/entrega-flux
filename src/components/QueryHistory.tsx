import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Package, TruckIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const QueryHistory = () => {
  const [freightHistory, setFreightHistory] = useState<any[]>([]);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const [freightData, trackingData] = await Promise.all([
        supabase
          .from('shipping_calculations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('tracking_queries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      if (freightData.data) setFreightHistory(freightData.data);
      if (trackingData.data) setTrackingHistory(trackingData.data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Agora mesmo';
    if (hours === 1) return 'Há 1 hora';
    if (hours < 24) return `Há ${hours} horas`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'Há 1 dia' : `Há ${days} dias`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Consultas Recentes</h3>
      
      {freightHistory.map((item) => (
        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TruckIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Cálculo de Frete</p>
              <p className="text-sm text-muted-foreground">
                {item.origin_zip} → {item.destination_zip}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(item.created_at)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">R$ {item.price?.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{item.delivery_days} dias</p>
            </div>
          </div>
        </Card>
      ))}

      {trackingHistory.map((item) => (
        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Package className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Rastreamento</p>
              <p className="text-sm text-muted-foreground">{item.tracking_code}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(item.created_at)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-secondary">{item.status}</p>
            </div>
          </div>
        </Card>
      ))}

      {freightHistory.length === 0 && trackingHistory.length === 0 && (
        <p className="text-center text-muted-foreground text-sm mt-6">
          Nenhuma consulta realizada ainda
        </p>
      )}
    </div>
  );
};
