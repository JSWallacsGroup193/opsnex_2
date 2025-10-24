import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Calculator,
  Zap,
  Radio,
  Settings,
  TrendingDown,
  Thermometer,
  Snowflake,
  Target,
  ClipboardList,
  Wind,
  Wrench,
  Gauge,
  Flame,
  FlaskConical,
  Droplet,
  Waves,
  Layers,
  CloudRain,
  Scale,
  RefreshCw,
  Ruler,
  type LucideIcon
} from 'lucide-react';

const CapacitorTestTool = lazy(() => import('./components/CapacitorTestTool'));
const MotorAmpsChecker = lazy(() => import('./components/MotorAmpsChecker'));
const VoltageDropTool = lazy(() => import('./components/VoltageDropTool'));
const OhmsLawCalculator = lazy(() => import('./components/OhmsLawCalculator'));
const SuperheatCalculator = lazy(() => import('./components/SuperheatCalculator'));
const SubcoolingCalculator = lazy(() => import('./components/SubcoolingCalculator'));
const TargetSuperheatTool = lazy(() => import('./components/TargetSuperheatTool'));
const PTChart = lazy(() => import('./components/PTChart'));
const CFMCalculator = lazy(() => import('./components/CFMCalculator'));
const DuctSizer = lazy(() => import('./components/DuctSizer'));
const StaticPressureTool = lazy(() => import('./components/StaticPressureTool'));
const GasPipeSizer = lazy(() => import('./components/GasPipeSizer'));
const CombustionAirCalculator = lazy(() => import('./components/CombustionAirCalculator'));
const CombustionAnalysisTool = lazy(() => import('./components/CombustionAnalysisTool'));
const ExpansionTankSizer = lazy(() => import('./components/ExpansionTankSizer'));
const HydronicFlowCalculator = lazy(() => import('./components/HydronicFlowCalculator'));
const RadiantHeatingCalculator = lazy(() => import('./components/RadiantHeatingCalculator'));
const PsychrometricCalculator = lazy(() => import('./components/PsychrometricCalculator'));
const TonnageCalculator = lazy(() => import('./components/TonnageCalculator'));
const HVACUnitConverter = lazy(() => import('./components/HVACUnitConverter'));
const HeatLoadCalculator = lazy(() => import('./components/HeatLoadCalculator'));
const AICostEstimator = lazy(() => import('./components/AICostEstimator'));
const ManualCostEstimator = lazy(() => import('./components/ManualCostEstimator'));

type CalculatorType = 'capacitor' | 'motor' | 'voltage' | 'ohms' | 'superheat' | 'subcooling' | 'target-superheat' | 'pt-chart' | 'cfm' | 'duct-sizer' | 'static-pressure' | 'gas-pipe' | 'combustion-air' | 'combustion-analysis' | 'expansion-tank' | 'hydronic-flow' | 'radiant-heating' | 'psychrometric' | 'tonnage' | 'unit-converter' | 'heat-load' | 'ai-estimator' | 'manual-estimator' | null;

interface Calculator {
  id: CalculatorType;
  name: string;
  icon: LucideIcon;
  description: string;
  component: React.ComponentType;
}

export default function FieldToolsPage() {
  const navigate = useNavigate();
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>(null);

  const calculators: Calculator[] = [
    {
      id: 'ai-estimator',
      name: 'AI Cost Estimator',
      icon: Cpu,
      description: 'AI-powered job cost estimates with GPT-4o',
      component: AICostEstimator
    },
    {
      id: 'manual-estimator',
      name: 'Manual Cost Estimator',
      icon: Calculator,
      description: 'Create detailed estimates manually (no AI required)',
      component: ManualCostEstimator
    },
    {
      id: 'ohms',
      name: "Ohm's Law",
      icon: Zap,
      description: 'Calculate V, I, R, and Power',
      component: OhmsLawCalculator
    },
    {
      id: 'capacitor',
      name: 'Capacitor Test',
      icon: Radio,
      description: 'Test capacitors with ±10% tolerance',
      component: CapacitorTestTool
    },
    {
      id: 'motor',
      name: 'Motor Amps Checker',
      icon: Settings,
      description: 'Check motor load percentage',
      component: MotorAmpsChecker
    },
    {
      id: 'voltage',
      name: 'Voltage Drop',
      icon: TrendingDown,
      description: 'Calculate voltage drop & wire sizing',
      component: VoltageDropTool
    },
    {
      id: 'superheat',
      name: 'Superheat Calculator',
      icon: Thermometer,
      description: 'Measure superheat for charge diagnosis',
      component: SuperheatCalculator
    },
    {
      id: 'subcooling',
      name: 'Subcooling Calculator',
      icon: Snowflake,
      description: 'Measure subcooling for charge verification',
      component: SubcoolingCalculator
    },
    {
      id: 'target-superheat',
      name: 'Target Superheat',
      icon: Target,
      description: 'Calculate target superheat from conditions',
      component: TargetSuperheatTool
    },
    {
      id: 'pt-chart',
      name: 'PT Chart',
      icon: ClipboardList,
      description: 'Pressure-Temperature reference chart',
      component: PTChart
    },
    {
      id: 'cfm',
      name: 'CFM Calculator',
      icon: Wind,
      description: 'Calculate airflow from BTU/hr and ΔT',
      component: CFMCalculator
    },
    {
      id: 'duct-sizer',
      name: 'Duct Sizer',
      icon: Wrench,
      description: 'Size ducts based on CFM and velocity',
      component: DuctSizer
    },
    {
      id: 'static-pressure',
      name: 'Static Pressure',
      icon: Gauge,
      description: 'Calculate total external static pressure',
      component: StaticPressureTool
    },
    {
      id: 'gas-pipe',
      name: 'Gas Pipe Sizer',
      icon: Flame,
      description: 'Size gas pipes for furnaces and appliances',
      component: GasPipeSizer
    },
    {
      id: 'combustion-air',
      name: 'Combustion Air',
      icon: Wind,
      description: 'Calculate combustion air requirements',
      component: CombustionAirCalculator
    },
    {
      id: 'combustion-analysis',
      name: 'Combustion Analysis',
      icon: FlaskConical,
      description: 'Reference values for combustion testing',
      component: CombustionAnalysisTool
    },
    {
      id: 'expansion-tank',
      name: 'Expansion Tank Sizer',
      icon: Droplet,
      description: 'Size expansion tanks for closed systems',
      component: ExpansionTankSizer
    },
    {
      id: 'hydronic-flow',
      name: 'Hydronic Flow',
      icon: Waves,
      description: 'Calculate GPM and pump sizing for hydronic systems',
      component: HydronicFlowCalculator
    },
    {
      id: 'radiant-heating',
      name: 'Radiant Floor',
      icon: Layers,
      description: 'Design radiant floor heating systems',
      component: RadiantHeatingCalculator
    },
    {
      id: 'psychrometric',
      name: 'Psychrometric',
      icon: CloudRain,
      description: 'Dew point, wet bulb, humidity calculations',
      component: PsychrometricCalculator
    },
    {
      id: 'tonnage',
      name: 'Tonnage Converter',
      icon: Scale,
      description: 'Convert BTU/hr to tons and vice versa',
      component: TonnageCalculator
    },
    {
      id: 'unit-converter',
      name: 'Unit Converter',
      icon: RefreshCw,
      description: 'Convert between HVAC units',
      component: HVACUnitConverter
    },
    {
      id: 'heat-load',
      name: 'Heat Load (Manual J)',
      icon: Ruler,
      description: 'Estimate heating and cooling requirements',
      component: HeatLoadCalculator
    }
  ];

  const selectedCalc = calculators.find(c => c.id === selectedCalculator);

  if (selectedCalculator && selectedCalc) {
    const SelectedComponent = selectedCalc.component;
    
    return (
      <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCalculator(null)}
            className="mb-4 flex items-center text-primary hover:text-primary/90 font-medium py-2 px-3 -ml-3 rounded-md hover:bg-primary/10 transition-colors touch-manipulation"
          >
            <span className="mr-2 text-lg">←</span> Back to Field Tools
          </button>
          
          <Suspense fallback={
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <SelectedComponent />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Field Tools</h1>
        <p className="text-slate-400 text-sm sm:text-base">Essential calcs. Quick estimates. Field-ready.</p>
      </div>
      
      <div className="p-3 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/estimates')}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Estimates
              </button>
              <button
                onClick={() => navigate('/proposals')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Proposals
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {calculators.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <button
                key={calc.id}
                onClick={() => setSelectedCalculator(calc.id)}
                className="bg-card rounded-lg shadow-md hover:shadow-lg active:shadow-xl transition-all p-5 sm:p-6 text-left group border border-border min-h-[140px] touch-manipulation"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-teal-500 transition-colors">
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 group-hover:text-teal-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                  {calc.name}
                </h3>
                
                <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                  {calc.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 bg-primary/10 border border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-3">About Field Tools</h2>
          <div className="text-muted-foreground space-y-2">
            <p>
              These professional-grade calculators help HVAC technicians make accurate measurements
              and diagnoses in the field.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All calculations follow industry standards and NEC guidelines</li>
              <li>Designed for mobile use on phones and tablets</li>
              <li>No internet connection required for calculations</li>
              <li>Results can be saved to work orders</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-lg shadow p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>Belt Drive Calculator</span>
            </div>
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>Energy Savings Calculator</span>
            </div>
            <div className="flex items-start gap-3">
              <Radio className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>Noise Level Assessment</span>
            </div>
            <div className="flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>Equipment Maintenance Scheduler</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
