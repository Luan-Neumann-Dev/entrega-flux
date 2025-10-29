import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Package, Calculator, History } from "lucide-react";
import { FreightCalculator } from "@/components/FreightCalculator";
import { TrackingSearch } from "@/components/TrackingSearch";
import { QueryHistory } from "@/components/QueryHistory";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Package className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ServiçoEntregas
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Integração completa com API dos Correios
          </p>
        </header>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-14">
            <TabsTrigger value="calculator" className="text-base">
              <Calculator className="w-5 h-5 mr-2" />
              Calcular Frete
            </TabsTrigger>
            <TabsTrigger value="tracking" className="text-base">
              <Package className="w-5 h-5 mr-2" />
              Rastreamento
            </TabsTrigger>
            <TabsTrigger value="history" className="text-base">
              <History className="w-5 h-5 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card className="p-6">
              <FreightCalculator />
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card className="p-6">
              <TrackingSearch />
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <QueryHistory />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
