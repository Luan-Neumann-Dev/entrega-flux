import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const TrackingSearch = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('track-package', {
        body: { trackingCode }
      });

      if (error) throw error;

      if (data?.success) {
        const lastUpdate = new Date(data.last_update);
        const timeAgo = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60));
        
        toast({
          title: "Encomenda Rastreada!",
          description: `Status: ${data.status} • Há ${timeAgo}h`,
        });
      } else {
        throw new Error(data?.error || 'Erro ao rastrear');
      }
    } catch (error) {
      console.error('Erro ao rastrear:', error);
      toast({
        title: "Erro ao rastrear",
        description: "Verifique o código e tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleTrack} className="space-y-6">
      <div>
        <Label htmlFor="trackingCode">Código de Rastreio</Label>
        <Input
          id="trackingCode"
          placeholder="AA123456789BR"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          required
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Digite o código de 13 caracteres dos Correios
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Rastreando...
          </>
        ) : (
          <>
            <Search className="mr-2 h-5 w-5" />
            Rastrear Encomenda
          </>
        )}
      </Button>
    </form>
  );
};
