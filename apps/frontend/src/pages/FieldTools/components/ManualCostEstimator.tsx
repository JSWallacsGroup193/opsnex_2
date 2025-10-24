import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, Clock, FileText, Plus, Trash2, Calculator } from 'lucide-react';
import api from '@/utils/axiosClient';
import toast from 'react-hot-toast';
import { SaveToWorkOrder } from './SaveToWorkOrder';

interface LineItem {
  id?: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface EstimateResult {
  id: string;
  title?: string;
  description?: string;
  laborHours?: number;
  laborCost?: number;
  materialsCost?: number;
  permitsCost?: number;
  overheadCost?: number;
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  finalPrice?: number;
  lineItems?: LineItem[];
}

export default function ManualCostEstimator() {
  const [mode, setMode] = useState<'quick' | 'comprehensive'>('quick');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [location, setLocation] = useState('');
  
  const [laborHours, setLaborHours] = useState('');
  const [laborRate, setLaborRate] = useState('75');
  const [materialsCost, setMaterialsCost] = useState('');
  const [permitsCost, setPermitsCost] = useState('');
  const [overheadPercent, setOverheadPercent] = useState('15');
  const [profitMargin, setProfitMargin] = useState('20');
  const [taxRate, setTaxRate] = useState('8.25');
  
  const [lineItems, setLineItems] = useState<Omit<LineItem, 'total'>[]>([]);

  const addLineItem = () => {
    setLineItems([...lineItems, { category: 'material', description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateLineItemsTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleQuickEstimate = async () => {
    const hours = parseFloat(laborHours) || 0;
    const rate = parseFloat(laborRate) || 0;
    const materials = parseFloat(materialsCost) || 0;
    const permits = parseFloat(permitsCost) || 0;
    const overheadPct = parseFloat(overheadPercent) || 0;
    const profitPct = parseFloat(profitMargin) || 0;
    const tax = parseFloat(taxRate) || 0;

    const laborCost = hours * rate;
    const subtotalBeforeOverhead = laborCost + materials + permits;
    const overhead = subtotalBeforeOverhead * (overheadPct / 100);

    setLoading(true);
    try {
      const response = await api.post('/estimator/manual', {
        estimateMode: 'quick',
        title: title || 'Quick Estimate',
        description,
        projectType,
        location,
        laborHours: hours,
        laborCost,
        materialsCost: materials,
        permitsCost: permits,
        overheadCost: overhead,
        taxRate: tax,
        profitMargin: profitPct,
      });

      setResult(response.data);
      toast.success('Estimate created successfully!');
    } catch (error: any) {
      console.error('Estimate error:', error);
      toast.error(error.response?.data?.message || 'Failed to create estimate');
    } finally {
      setLoading(false);
    }
  };

  const handleComprehensiveEstimate = async () => {
    if (lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    const tax = parseFloat(taxRate) || 0;

    setLoading(true);
    try {
      const response = await api.post('/estimator/manual', {
        estimateMode: 'comprehensive',
        title: title || 'Comprehensive Estimate',
        description,
        projectType,
        location,
        taxRate: tax,
        lineItems: lineItems.map(item => ({
          category: item.category,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      setResult(response.data);
      toast.success('Estimate created successfully!');
    } catch (error: any) {
      console.error('Estimate error:', error);
      toast.error(error.response?.data?.message || 'Failed to create estimate');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'quick') {
      handleQuickEstimate();
    } else {
      handleComprehensiveEstimate();
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
            Manual Cost Estimator
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Create detailed cost estimates manually (no AI required)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Mode Selection */}
          <div className="space-y-2">
            <Label className="text-base">Estimate Mode</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setMode('quick')}
                className={`p-4 sm:p-5 rounded-lg border-2 transition-all touch-manipulation min-h-[100px] sm:min-h-[110px] ${
                  mode === 'quick'
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-slate-700 hover:border-slate-600 active:border-slate-500 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-base">Quick Mode</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Simple inputs: labor, materials, permits, overhead
                </p>
              </button>
              
              <button
                onClick={() => setMode('comprehensive')}
                className={`p-4 sm:p-5 rounded-lg border-2 transition-all touch-manipulation min-h-[100px] sm:min-h-[110px] ${
                  mode === 'comprehensive'
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-slate-700 hover:border-slate-600 active:border-slate-500 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-base">Comprehensive</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Detailed line items with full breakdown
                </p>
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Estimate Title</Label>
              <Input
                id="title"
                placeholder="e.g., AC Installation - Smith Residence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input
                id="projectType"
                placeholder="e.g., AC Installation, Furnace Repair"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Austin, TX"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                placeholder="8.25"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional project details or notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Quick Mode Inputs */}
          {mode === 'quick' && (
            <div className="space-y-4 p-4 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-lg">Cost Components</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laborHours">Labor Hours</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    step="0.5"
                    placeholder="8"
                    value={laborHours}
                    onChange={(e) => setLaborHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laborRate">Labor Rate ($/hr)</Label>
                  <Input
                    id="laborRate"
                    type="number"
                    step="5"
                    placeholder="75"
                    value={laborRate}
                    onChange={(e) => setLaborRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materialsCost">Materials Cost ($)</Label>
                  <Input
                    id="materialsCost"
                    type="number"
                    step="0.01"
                    placeholder="1500"
                    value={materialsCost}
                    onChange={(e) => setMaterialsCost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permitsCost">Permits & Fees ($)</Label>
                  <Input
                    id="permitsCost"
                    type="number"
                    step="0.01"
                    placeholder="150"
                    value={permitsCost}
                    onChange={(e) => setPermitsCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overheadPercent">Overhead (%)</Label>
                  <Input
                    id="overheadPercent"
                    type="number"
                    step="1"
                    placeholder="15"
                    value={overheadPercent}
                    onChange={(e) => setOverheadPercent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    step="1"
                    placeholder="20"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Comprehensive Mode Inputs */}
          {mode === 'comprehensive' && (
            <div className="space-y-4 p-4 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Line Items</h3>
                <Button onClick={addLineItem} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {lineItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No line items yet. Click "Add Item" to get started.
                </p>
              )}

              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-3 p-3 bg-slate-900/50 dark:bg-black/30 rounded border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-teal-500">Item #{index + 1}</span>
                    <Button
                      onClick={() => removeLineItem(index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Category</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-slate-700 bg-slate-900 dark:bg-slate-950 text-sm"
                        value={item.category}
                        onChange={(e) => updateLineItem(index, 'category', e.target.value)}
                      >
                        <option value="labor">Labor</option>
                        <option value="material">Material</option>
                        <option value="equipment">Equipment</option>
                        <option value="permit">Permit</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Unit Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Total</Label>
                      <div className="h-10 px-3 rounded-md border border-slate-700 bg-slate-950 dark:bg-black flex items-center text-sm font-semibold text-teal-500">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {lineItems.length > 0 && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="text-lg font-bold text-teal-500">
                    {formatCurrency(calculateLineItemsTotal())}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Estimate...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Create {mode === 'quick' ? 'Quick' : 'Comprehensive'} Estimate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4 sm:space-y-6">
          {/* Summary Card */}
          <Card className="border-teal-500/50 bg-teal-500/5 dark:bg-teal-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
                Total Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold text-teal-500 mb-3 sm:mb-4">
                {formatCurrency(result.finalPrice)}
              </div>
              {result.title && (
                <p className="text-sm sm:text-base font-semibold mb-1">{result.title}</p>
              )}
              {result.description && (
                <p className="text-sm text-muted-foreground">{result.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Breakdown */}
          {mode === 'quick' && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.laborHours && result.laborCost && (
                    <div className="flex justify-between py-2 border-b border-slate-700 dark:border-slate-800">
                      <span className="text-muted-foreground">Labor ({result.laborHours} hrs)</span>
                      <span className="font-semibold">{formatCurrency(result.laborCost)}</span>
                    </div>
                  )}
                  {result.materialsCost && (
                    <div className="flex justify-between py-2 border-b border-slate-700 dark:border-slate-800">
                      <span className="text-muted-foreground">Materials</span>
                      <span className="font-semibold">{formatCurrency(result.materialsCost)}</span>
                    </div>
                  )}
                  {result.permitsCost && (
                    <div className="flex justify-between py-2 border-b border-slate-700 dark:border-slate-800">
                      <span className="text-muted-foreground">Permits & Fees</span>
                      <span className="font-semibold">{formatCurrency(result.permitsCost)}</span>
                    </div>
                  )}
                  {result.overheadCost && (
                    <div className="flex justify-between py-2 border-b border-slate-700 dark:border-slate-800">
                      <span className="text-muted-foreground">Overhead</span>
                      <span className="font-semibold">{formatCurrency(result.overheadCost)}</span>
                    </div>
                  )}
                  {result.taxAmount && (
                    <div className="flex justify-between py-2 border-b border-slate-700 dark:border-slate-800">
                      <span className="text-muted-foreground">Tax ({result.taxRate}%)</span>
                      <span className="font-semibold">{formatCurrency(result.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 pt-4 border-t-2 border-teal-500">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-teal-500">
                      {formatCurrency(result.finalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Line Items */}
          {mode === 'comprehensive' && result.lineItems && result.lineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-700 dark:border-slate-800">
                        <th className="text-left py-2 px-2 text-sm font-semibold">Category</th>
                        <th className="text-left py-2 px-2 text-sm font-semibold">Description</th>
                        <th className="text-right py-2 px-2 text-sm font-semibold">Qty</th>
                        <th className="text-right py-2 px-2 text-sm font-semibold">Unit Price</th>
                        <th className="text-right py-2 px-2 text-sm font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.lineItems.map((item, index) => (
                        <tr key={index} className="border-b border-slate-800 dark:border-slate-900">
                          <td className="py-3 px-2 text-sm font-medium capitalize">{item.category}</td>
                          <td className="py-3 px-2 text-sm">{item.description}</td>
                          <td className="py-3 px-2 text-sm text-right">{item.quantity}</td>
                          <td className="py-3 px-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-3 px-2 text-sm text-right font-semibold">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save to Work Order */}
          <SaveToWorkOrder
            calculatorType="Manual Cost Estimator"
            category="Estimating"
            inputs={{
              mode,
              title: result.title,
              projectType,
              location,
            }}
            results={{
              estimatedCost: result.finalPrice,
              breakdown: mode === 'quick' ? {
                laborHours: result.laborHours,
                laborCost: result.laborCost,
                materialsCost: result.materialsCost,
                permitsCost: result.permitsCost,
                overheadCost: result.overheadCost,
                taxAmount: result.taxAmount,
              } : undefined,
              lineItems: mode === 'comprehensive' ? result.lineItems : undefined,
            }}
          />
        </div>
      )}
    </div>
  );
}
