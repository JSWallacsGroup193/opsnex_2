import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServicesTab } from './components/ServicesTab';
import { BundlesTab } from './components/BundlesTab';
import { LaborRatesTab } from './components/LaborRatesTab';

export function ServiceCatalogPage() {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Service Catalog</h1>
        <p className="text-slate-400 text-sm sm:text-base">Standardize services. Lock in pricing. No gray area.</p>
      </div>
      
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bundles">Bundles</TabsTrigger>
          <TabsTrigger value="labor-rates">Labor Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>

        <TabsContent value="bundles">
          <BundlesTab />
        </TabsContent>

        <TabsContent value="labor-rates">
          <LaborRatesTab />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
