import { Card } from "@/components/ui/card";
import { Clock, Package, TruckIcon } from "lucide-react";

export const QueryHistory = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Consultas Recentes</h3>
      
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <TruckIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Cálculo de Frete</p>
            <p className="text-sm text-muted-foreground">01310-100 → 04567-890</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              Há 2 horas
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">R$ 25,00</p>
            <p className="text-sm text-muted-foreground">5 dias</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg">
            <Package className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Rastreamento</p>
            <p className="text-sm text-muted-foreground">AA123456789BR</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              Há 5 horas
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-secondary">Em trânsito</p>
          </div>
        </div>
      </Card>

      <p className="text-center text-muted-foreground text-sm mt-6">
        O histórico completo será carregado do banco de dados
      </p>
    </div>
  );
};
