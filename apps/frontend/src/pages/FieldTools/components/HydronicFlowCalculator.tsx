import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function HydronicFlowCalculator() {
  const [btuh, setBtuh] = useState<number | ''>('');
  const [deltaT, setDeltaT] = useState<number | ''>('');
  const [result, setResult] = useState<{
    gpm: number;
    velocityWarning: string;
    pumpSize: string;
  } | null>(null);

  const calculate = () => {
    if (btuh === '' || deltaT === '') {
      alert('Enter all fields');
      return;
    }

    const b = Number(btuh);
    const dt = Number(deltaT);

    if (dt === 0) {
      alert('Delta-T cannot be zero');
      return;
    }

    // Formula: GPM = BTU/hr ÷ (500 × ΔT)
    // Where 500 = specific heat of water (1 BTU/lb/°F) × 60 min/hr × 8.33 lb/gal
    const gpm = b / (500 * dt);

    // Determine velocity warning
    let velocityWarning = '✅ Normal flow rate';
    if (gpm < 1) {
      velocityWarning = '⚠️ Very low flow - check for restrictions';
    } else if (gpm > 10) {
      velocityWarning = '⚠️ High flow - may cause noise or erosion';
    }

    // Suggest pump size based on GPM
    let pumpSize = '';
    if (gpm <= 3) {
      pumpSize = 'Small (1/12 - 1/8 HP)';
    } else if (gpm <= 6) {
      pumpSize = 'Medium (1/6 - 1/4 HP)';
    } else if (gpm <= 12) {
      pumpSize = 'Large (1/3 - 1/2 HP)';
    } else {
      pumpSize = 'Extra Large (3/4+ HP)';
    }

    setResult({
      gpm,
      velocityWarning,
      pumpSize,
    });
  };

  const reset = () => {
    setBtuh('');
    setDeltaT('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hydronic Flow Calculator</h2>
        <p className="text-gray-600">Calculate required flow rate (GPM) and pump sizing for hydronic systems</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Heating/Cooling Load (BTU/hr)
          </label>
          <input
            type="number"
            placeholder="Enter BTU/hr"
            value={btuh}
            onChange={(e) => setBtuh(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Total system capacity or zone load</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature Differential (ΔT in °F)
          </label>
          <input
            type="number"
            placeholder="Enter delta-T"
            value={deltaT}
            onChange={(e) => setDeltaT(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Supply temp - Return temp (typically 10-30°F)</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Flow
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {result && (
          <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-lg mb-3">Results:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Required Flow Rate:</span>
                <span className="text-2xl font-bold text-blue-700">
                  {result.gpm.toFixed(2)} GPM
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Suggested Pump Size:</span>
                <span className="text-lg">{result.pumpSize}</span>
              </div>

              <div className="pt-2 border-t border-blue-300">
                <p className="font-medium mb-1">Flow Assessment:</p>
                <p className="text-sm">{result.velocityWarning}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Hydronic Flow Formula:</h4>
          <p className="mb-2 font-mono bg-white p-2 rounded">GPM = BTU/hr ÷ (500 × ΔT)</p>
          <ul className="space-y-1">
            <li>• 500 = Water constant (specific heat × density × 60 min/hr)</li>
            <li>• Typical ΔT for heating: 20°F (180° supply, 160° return)</li>
            <li>• Typical ΔT for cooling: 10-15°F (45° supply, 55-60° return)</li>
            <li>• Higher ΔT = Lower flow rate (smaller pump, pipes)</li>
            <li>• Lower ΔT = Higher flow rate (larger pump, better heat transfer)</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
          <h4 className="font-semibold mb-2 text-blue-900">Design Guidelines:</h4>
          <ul className="space-y-1 text-blue-800">
            <li>• Residential radiant floor: 10-15°F ΔT</li>
            <li>• Baseboard/radiators: 20-30°F ΔT</li>
            <li>• Fan coils: 15-20°F ΔT</li>
            <li>• Maximum velocity: 4 ft/sec (to prevent noise and erosion)</li>
            <li>• Minimum velocity: 2 ft/sec (to ensure proper circulation)</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Hydronic Flow Calculator"
            category="hydronic"
            inputs={{ btuh, deltaT }}
            results={{ gpm: result.gpm, velocityWarning: result.velocityWarning, pumpSize: result.pumpSize }}
          />
        )}
      </div>
    </div>
  );
}
