import { useState } from 'react';

type FuelType = 'natural-gas' | 'propane' | 'oil';

interface CombustionRanges {
  fuel: string;
  o2Range: string;
  co2Range: string;
  coRange: string;
  flueRange: string;
  description: string;
}

const combustionData: Record<FuelType, CombustionRanges> = {
  'natural-gas': {
    fuel: 'Natural Gas',
    o2Range: '3-6%',
    co2Range: '8-10%',
    coRange: '< 100 ppm',
    flueRange: '275-350°F',
    description: 'Most common residential fuel'
  },
  'propane': {
    fuel: 'Propane (LP)',
    o2Range: '4-9%',
    co2Range: '6-8%',
    coRange: '< 50 ppm',
    flueRange: '325-400°F',
    description: 'Higher combustion temperature than natural gas'
  },
  'oil': {
    fuel: 'Fuel Oil',
    o2Range: '6-10%',
    co2Range: '10-12%',
    coRange: '< 50 ppm',
    flueRange: '400-600°F',
    description: 'Requires annual cleaning and maintenance'
  },
};

export default function CombustionAnalysisTool() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>('natural-gas');

  const data = combustionData[selectedFuel];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Combustion Analysis Reference</h2>
        <p className="text-gray-600">Target combustion values for common fuel types</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Fuel Type
          </label>
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value as FuelType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="natural-gas">Natural Gas</option>
            <option value="propane">Propane (LP Gas)</option>
            <option value="oil">Fuel Oil (#2 Heating Oil)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">{data.description}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="font-bold text-lg text-blue-900 mb-4">{data.fuel} - Target Ranges</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded">
              <div>
                <span className="font-semibold text-gray-700">Oxygen (O₂)</span>
                <p className="text-xs text-gray-500">Excess air indicator</p>
              </div>
              <span className="text-xl font-bold text-blue-700">{data.o2Range}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded">
              <div>
                <span className="font-semibold text-gray-700">Carbon Dioxide (CO₂)</span>
                <p className="text-xs text-gray-500">Combustion completeness</p>
              </div>
              <span className="text-xl font-bold text-blue-700">{data.co2Range}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded">
              <div>
                <span className="font-semibold text-gray-700">Carbon Monoxide (CO)</span>
                <p className="text-xs text-gray-500">Safety critical - must be low</p>
              </div>
              <span className="text-xl font-bold text-red-700">{data.coRange}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded">
              <div>
                <span className="font-semibold text-gray-700">Flue Gas Temperature</span>
                <p className="text-xs text-gray-500">Net stack temperature</p>
              </div>
              <span className="text-xl font-bold text-blue-700">{data.flueRange}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Understanding Combustion Analysis:</h4>
          <ul className="space-y-1">
            <li>• <strong>O₂ (Oxygen):</strong> Measures excess air. Too high = inefficient, too low = incomplete combustion</li>
            <li>• <strong>CO₂ (Carbon Dioxide):</strong> Ideal combustion product. Higher is generally better (within range)</li>
            <li>• <strong>CO (Carbon Monoxide):</strong> Dangerous gas. Must be very low. High CO = serious safety issue</li>
            <li>• <strong>Flue Temp:</strong> Exhaust temperature. Too high = heat loss, too low = condensation issues</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm">
          <h4 className="font-semibold text-yellow-800 mb-2">When to Perform Combustion Analysis:</h4>
          <ul className="space-y-1 text-yellow-700">
            <li>✓ Annual maintenance on all gas/oil equipment</li>
            <li>✓ After any burner adjustment or service</li>
            <li>✓ When investigating efficiency concerns</li>
            <li>✓ If sooting or yellow flames are present</li>
            <li>✓ When customer reports headaches or illness</li>
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-sm">
          <h4 className="font-semibold text-red-800 mb-2">🚨 High CO Warning Signs:</h4>
          <ul className="space-y-1 text-red-700">
            <li>• Soot or discoloration around equipment</li>
            <li>• Yellow or orange flames (should be blue)</li>
            <li>• Excessive condensation on windows</li>
            <li>• Pilot light frequently goes out</li>
            <li>• Stale or stuffy air in the house</li>
          </ul>
          <p className="mt-2 font-semibold">If CO {'>'} 100 ppm: Turn off equipment immediately and investigate!</p>
        </div>
      </div>
    </div>
  );
}
