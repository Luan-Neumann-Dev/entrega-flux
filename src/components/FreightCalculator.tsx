import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TruckIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const FreightCalculator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    originZip: "",
    destinationZip: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('calculate-freight', {
        body: {
          originZip: formData.originZip,
          destinationZip: formData.destinationZip,
          weight: formData.weight,
          length: formData.length,
          width: formData.width,
          height: formData.height,
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Frete Calculado!",
          description: `Prazo: ${data.delivery_days} dias úteis • Valor: R$ ${data.price}`,
        });
      } else {
        throw new Error(data?.error || 'Erro ao calcular frete');
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast({
        title: "Erro ao calcular",
        description: "Tente novamente em instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCalculate} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="originZip">CEP de Origem</Label>
          <Input
            id="originZip"
            placeholder="00000-000"
            value={formData.originZip}
            onChange={(e) => setFormData({ ...formData, originZip: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="destinationZip">CEP de Destino</Label>
          <Input
            id="destinationZip"
            placeholder="00000-000"
            value={formData.destinationZip}
            onChange={(e) => setFormData({ ...formData, destinationZip: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            placeholder="1.5"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="length">Comprimento (cm)</Label>
          <Input
            id="length"
            type="number"
            placeholder="30"
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="width">Largura (cm)</Label>
          <Input
            id="width"
            type="number"
            placeholder="20"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="10"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Calculando...
          </>
        ) : (
          <>
            <TruckIcon className="mr-2 h-5 w-5" />
            Calcular Frete
          </>
        )}
      </Button>
    </form>
  );
};
