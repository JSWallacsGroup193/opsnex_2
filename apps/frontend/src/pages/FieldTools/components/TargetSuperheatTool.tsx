import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function TargetSuperheatTool() {
  const [wetBulb, setWetBulb] = useState<number | ''>('');
  const [dryBulb, setDryBulb] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (wetBulb === '' || dryBulb === '') {
      alert('Enter both temperatures');
      return;
    }

    const wb = Number(wetBulb);
    const db = Number(dryBulb);

    const targetSH = 0.7 * wb + 0.2 * db + 10;

    setResult(targetSH);
  };

  const reset = () => {
    setWetBulb('');
    setDryBulb('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Target Superheat Tool</h2>
        <p className="text-gray-600">Determine target superheat based on ambient conditions</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Indoor Wet Bulb Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter wet bulb temp"
            value={wetBulb}
            onChange={(e) => setWetBulb(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Measure at return air grill with wet bulb thermometer</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Outdoor Dry Bulb Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter dry bulb temp"
            value={dryBulb}
            onChange={(e) => setDryBulb(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Measure outdoor ambient temperature</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Target
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {result !== null && (
          <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-lg mb-2">Target Superheat:</h3>
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {result.toFixed(1)}°F
            </div>
            <p className="text-sm text-gray-700">
              Use this value as the target when measuring actual superheat with the Superheat Calculator.
            </p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">How to Use:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Measure indoor wet bulb temperature at return air</li>
            <li>Measure outdoor dry bulb (ambient) temperature</li>
            <li>Calculate target superheat using this tool</li>
            <li>Compare to actual superheat using Superheat Calculator</li>
            <li>Adjust refrigerant charge if needed</li>
          </ol>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm">
          <p className="font-semibold text-yellow-800 mb-1">Note:</p>
          <p className="text-yellow-700">
            This calculation provides an estimate for fixed orifice (TXV-less) systems.
            Always consult manufacturer specifications when available.
          </p>
        </div>

        {result !== null && (
          <SaveToWorkOrder
            calculatorType="Target Superheat Calculator"
            category="refrigeration"
            inputs={{ indoorWetBulb: wetBulb, outdoorDryBulb: dryBulb }}
            results={{ targetSuperheat: result }}
          />
        )}
      </div>
    </div>
  );
}
