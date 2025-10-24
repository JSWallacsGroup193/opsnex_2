import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, Clock, FileText, Sparkles } from 'lucide-react';
import api from '@/utils/axiosClient';
import toast from 'react-hot-toast';
import { SaveToWorkOrder } from './SaveToWorkOrder';

interface EstimateResult {
  customer_summary: {
    finalPrice: number;
    summaryMessage: string;
  };
  internal_calculations: {
    laborHours: number;
    laborCost: number;
    materialsCost: number;
    permitsCost: number;
    overheadCost: number;
    profitMargin: number;
    totalCost: number;
  };
  line_items: Array<{
    category: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

export default function AICostEstimator() {
  const [mode, setMode] = useState<'quick' | 'comprehensive'>('quick');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  
  // Form fields
  const [projectType, setProjectType] = useState('');
  const [location, setLocation] = useState('');
  const [systemDetails, setSystemDetails] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleEstimate = async () => {
    if (!projectType.trim()) {
      toast.error('Please enter a project type');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/estimator/calculate', {
        estimateMode: mode,
        projectType: projectType.trim(),
        location: location.trim() || 'Not specified',
        systemDetails: systemDetails.trim() || 'Not specified',
        additionalNotes: additionalNotes.trim() || 'None',
      });

      setResult(response.data);
      toast.success('Estimate generated successfully!');
    } catch (error: any) {
      console.error('Estimate error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate estimate');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
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
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
            AI Cost Estimator
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Get AI-powered cost estimates for HVAC projects using GPT-4o
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
                    : 'border-slate-700 hover:border-slate-600 active:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-base">Quick (5-min)</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Fast ballpark estimate for simple projects
                </p>
              </button>
              
              <button
                onClick={() => setMode('comprehensive')}
                className={`p-4 sm:p-5 rounded-lg border-2 transition-all touch-manipulation min-h-[100px] sm:min-h-[110px] ${
                  mode === 'comprehensive'
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-slate-700 hover:border-slate-600 active:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-base">Comprehensive</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Detailed breakdown with line items
                </p>
              </button>
            </div>
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="projectType">
              Project Type <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectType"
              placeholder="e.g., AC Installation, Heat Pump Replacement, Furnace Repair"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (City, State)</Label>
            <Input
              id="location"
              placeholder="e.g., Austin, TX"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* System Details */}
          <div className="space-y-2">
            <Label htmlFor="systemDetails">System Details</Label>
            <Textarea
              id="systemDetails"
              placeholder="e.g., 3-ton AC unit, 2-story home, existing ductwork in good condition"
              value={systemDetails}
              onChange={(e) => setSystemDetails(e.target.value)}
              rows={3}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any special requirements, access issues, or customer requests"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleEstimate}
            disabled={loading || !projectType.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Estimate...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate {mode === 'quick' ? 'Quick' : 'Comprehensive'} Estimate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4 sm:space-y-6">
          {/* Summary Card */}
          <Card className="border-teal-500/50 bg-teal-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
                Estimated Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold text-teal-500 mb-3 sm:mb-4">
                {formatCurrency(result.customer_summary.finalPrice)}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                {result.customer_summary.summaryMessage}
              </p>
            </CardContent>
          </Card>

          {/* Internal Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of all costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-muted-foreground">Labor ({result.internal_calculations.laborHours} hrs)</span>
                  <span className="font-semibold">{formatCurrency(result.internal_calculations.laborCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-muted-foreground">Materials</span>
                  <span className="font-semibold">{formatCurrency(result.internal_calculations.materialsCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-muted-foreground">Permits & Fees</span>
                  <span className="font-semibold">{formatCurrency(result.internal_calculations.permitsCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-muted-foreground">Overhead</span>
                  <span className="font-semibold">{formatCurrency(result.internal_calculations.overheadCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-muted-foreground">Profit Margin ({result.internal_calculations.profitMargin}%)</span>
                  <span className="font-semibold">
                    {formatCurrency(result.customer_summary.finalPrice - result.internal_calculations.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between py-3 pt-4 border-t-2 border-teal-500">
                  <span className="font-bold text-lg">Total Estimate</span>
                  <span className="font-bold text-lg text-teal-500">
                    {formatCurrency(result.customer_summary.finalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items (if comprehensive) */}
          {result.line_items && result.line_items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Line Items</CardTitle>
                <CardDescription className="text-sm sm:text-base">Itemized cost details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-2 px-2 text-sm font-semibold">Category</th>
                          <th className="text-left py-2 px-2 text-sm font-semibold">Description</th>
                          <th className="text-right py-2 px-2 text-sm font-semibold whitespace-nowrap">Qty</th>
                          <th className="text-right py-2 px-2 text-sm font-semibold whitespace-nowrap">Unit Price</th>
                          <th className="text-right py-2 px-2 text-sm font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.line_items.map((item, index) => (
                          <tr key={index} className="border-b border-slate-800">
                            <td className="py-3 px-2 text-sm font-medium whitespace-nowrap">{item.category}</td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">{item.description}</td>
                            <td className="py-3 px-2 text-sm text-right">{item.quantity}</td>
                            <td className="py-3 px-2 text-sm text-right whitespace-nowrap">{formatCurrency(item.unit_price)}</td>
                            <td className="py-3 px-2 text-sm text-right font-semibold whitespace-nowrap">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 sm:hidden">
                  Scroll horizontally to see all columns →
                </p>
              </CardContent>
            </Card>
          )}

          {/* Save to Work Order */}
          <SaveToWorkOrder
            calculatorType="AI Cost Estimator"
            category="Estimating"
            inputs={{
              mode,
              projectType,
              location,
              systemDetails,
              additionalNotes,
            }}
            results={{
              estimatedCost: result.customer_summary.finalPrice,
              laborHours: result.internal_calculations.laborHours,
              laborCost: result.internal_calculations.laborCost,
              materialsCost: result.internal_calculations.materialsCost,
              breakdown: result.internal_calculations,
              summary: result.customer_summary.summaryMessage,
            }}
          />
        </div>
      )}

      {/* Info */}
      <Card className="bg-blue-500/10 border-blue-500/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">About AI Cost Estimator</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Powered by OpenAI GPT-4o for intelligent estimates</li>
                <li>Quick mode provides fast ballpark figures</li>
                <li>Comprehensive mode includes detailed line items</li>
                <li>All estimates are saved to your account</li>
                <li>Results can be attached to work orders</li>
              </ul>
              <p className="text-xs italic pt-2">
                Note: AI estimates are for planning purposes only. Always verify costs with suppliers and adjust for local market conditions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
