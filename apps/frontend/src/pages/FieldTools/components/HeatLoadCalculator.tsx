import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

type ClimateZone = 'hot' | 'moderate' | 'cold';
type Insulation = 'poor' | 'average' | 'good';

export default function HeatLoadCalculator() {
  const [squareFeet, setSquareFeet] = useState<number | ''>('');
  const [climateZone, setClimateZone] = useState<ClimateZone>('moderate');
  const [insulation, setInsulation] = useState<Insulation>('average');
  const [ceilingHeight, setCeilingHeight] = useState<number | ''>(8);
  const [windows, setWindows] = useState<number | ''>('');
  const [result, setResult] = useState<{
    heatingLoad: number;
    coolingLoad: number;
    heatingTonnage: number;
    coolingTonnage: number;
    cfmRequired: number;
  } | null>(null);

  const calculate = () => {
    if (squareFeet === '' || windows === '' || ceilingHeight === '') {
      alert('Enter all required fields');
      return;
    }

    const area = Number(squareFeet);
    const windowArea = Number(windows);
    const height = Number(ceilingHeight);

    let heatingMultiplier = 25;
    let coolingMultiplier = 25;

    if (climateZone === 'hot') {
      heatingMultiplier = 15;
      coolingMultiplier = 35;
    } else if (climateZone === 'cold') {
      heatingMultiplier = 40;
      coolingMultiplier = 20;
    }

    if (insulation === 'poor') {
      heatingMultiplier *= 1.3;
      coolingMultiplier *= 1.3;
    } else if (insulation === 'good') {
      heatingMultiplier *= 0.8;
      coolingMultiplier *= 0.8;
    }

    const heightFactor = height / 8;
    const windowFactor = 1 + (windowArea / area) * 0.5;

    const heatingLoad = Math.round(area * heatingMultiplier * heightFactor * windowFactor);
    const coolingLoad = Math.round(area * coolingMultiplier * heightFactor * windowFactor);
    
    const heatingTonnage = heatingLoad / 12000;
    const coolingTonnage = coolingLoad / 12000;
    const cfmRequired = Math.round(coolingTonnage * 400);

    setResult({
      heatingLoad,
      coolingLoad,
      heatingTonnage,
      coolingTonnage,
      cfmRequired,
    });
  };

  const reset = () => {
    setSquareFeet('');
    setClimateZone('moderate');
    setInsulation('average');
    setCeilingHeight(8);
    setWindows('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Heat Load Calculator</h2>
        <p className="text-gray-600">Simplified Manual J - Estimate heating and cooling requirements</p>
      </div>

      <div className="space-y-4">
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm text-yellow-800">
          <strong>Note:</strong> This is a simplified calculator for quick estimates. For accurate equipment sizing, 
          perform a full Manual J load calculation.
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Square Footage
          </label>
          <input
            type="number"
            placeholder="Enter square feet"
            value={squareFeet}
            onChange={(e) => setSquareFeet(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Conditioned living space only</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Window Area (sq ft)
          </label>
          <input
            type="number"
            placeholder="Enter window area"
            value={windows}
            onChange={(e) => setWindows(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Approximate total of all windows</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ceiling Height (feet)
          </label>
          <input
            type="number"
            placeholder="Enter ceiling height"
            value={ceilingHeight}
            onChange={(e) => setCeilingHeight(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Standard is 8 feet</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Climate Zone
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setClimateZone('hot')}
              className={`px-4 py-2 rounded-md font-medium ${
                climateZone === 'hot'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Hot
            </button>
            <button
              onClick={() => setClimateZone('moderate')}
              className={`px-4 py-2 rounded-md font-medium ${
                climateZone === 'moderate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Moderate
            </button>
            <button
              onClick={() => setClimateZone('cold')}
              className={`px-4 py-2 rounded-md font-medium ${
                climateZone === 'cold'
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cold
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insulation Quality
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setInsulation('poor')}
              className={`px-4 py-2 rounded-md font-medium ${
                insulation === 'poor'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Poor
            </button>
            <button
              onClick={() => setInsulation('average')}
              className={`px-4 py-2 rounded-md font-medium ${
                insulation === 'average'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Average
            </button>
            <button
              onClick={() => setInsulation('good')}
              className={`px-4 py-2 rounded-md font-medium ${
                insulation === 'good'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Good
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Load
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 rounded-md bg-red-50 border border-red-300">
              <h3 className="font-bold text-lg mb-2 text-red-900">Heating Load:</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">BTU/hr:</span>
                  <span className="text-xl font-bold text-red-700">
                    {result.heatingLoad.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Furnace Size:</span>
                  <span className="text-lg">{result.heatingTonnage.toFixed(2)} tons</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-md bg-blue-50 border border-blue-300">
              <h3 className="font-bold text-lg mb-2 text-blue-900">Cooling Load:</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">BTU/hr:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {result.coolingLoad.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">AC Size:</span>
                  <span className="text-lg">{result.coolingTonnage.toFixed(2)} tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">CFM Required:</span>
                  <span className="text-lg">{result.cfmRequired.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-green-50 border border-green-300 text-sm">
              <h4 className="font-semibold text-green-900 mb-1">Equipment Recommendations:</h4>
              <p className="text-green-800">
                💡 Nearest standard size: <strong>{Math.round(result.coolingTonnage * 2) / 2} tons</strong>
                <br />
                <span className="text-xs">
                  (Don't oversize - reduces efficiency and comfort)
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Heat Load Estimation Rules:</h4>
          <ul className="space-y-1">
            <li>• <strong>Rule of Thumb:</strong> 20-30 BTU per sq ft (varies by climate)</li>
            <li>• <strong>Hot Climate:</strong> More cooling, less heating needed</li>
            <li>• <strong>Cold Climate:</strong> More heating, less cooling needed</li>
            <li>• <strong>Insulation:</strong> Good insulation reduces load 20-30%</li>
            <li>• <strong>Windows:</strong> Major source of heat gain/loss</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
          <h4 className="font-semibold mb-2 text-blue-900">Full Manual J Factors:</h4>
          <ul className="space-y-1 text-blue-800">
            <li>• Building orientation and sun exposure</li>
            <li>• Window type (single/double pane, low-E)</li>
            <li>• Wall and attic insulation R-values</li>
            <li>• Infiltration and air changes per hour</li>
            <li>• Occupancy and internal heat gains</li>
            <li>• Local climate data (design temperatures)</li>
          </ul>
          <p className="mt-2 text-xs text-blue-700">
            For commercial projects or precise sizing, always perform a full Manual J calculation.
          </p>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Heat Load Calculator (Manual J)"
            category="utilities"
            inputs={{ squareFeet, climateZone, insulation, ceilingHeight, windows }}
            results={{ heatingLoad: result.heatingLoad, coolingLoad: result.coolingLoad, heatingTonnage: result.heatingTonnage, coolingTonnage: result.coolingTonnage, cfmRequired: result.cfmRequired }}
          />
        )}
      </div>
    </div>
  );
}
