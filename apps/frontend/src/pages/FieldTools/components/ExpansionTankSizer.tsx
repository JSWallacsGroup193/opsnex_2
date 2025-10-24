import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function ExpansionTankSizer() {
  const [systemVolume, setSystemVolume] = useState<number | ''>('');
  const [fillPressure, setFillPressure] = useState<number | ''>('');
  const [maxPressure, setMaxPressure] = useState<number | ''>('');
  const [fillTemp, setFillTemp] = useState<number | ''>('');
  const [maxTemp, setMaxTemp] = useState<number | ''>('');
  const [result, setResult] = useState<{
    tankSize: number;
    acceptanceVolume: number;
    expansionRate: number;
  } | null>(null);

  const calculate = () => {
    if (systemVolume === '' || fillPressure === '' || maxPressure === '' || fillTemp === '' || maxTemp === '') {
      alert('Enter all fields');
      return;
    }

    const vol = Number(systemVolume);
    const pf = Number(fillPressure);
    const pm = Number(maxPressure);
    const tf = Number(fillTemp);
    const tm = Number(maxTemp);

    // Calculate expansion rate (approximately 0.0002 per °F for water)
    const expansionRate = ((tm - tf) * 0.0002) * 100; // Convert to percentage
    const expandedVolume = vol * (expansionRate / 100);

    // Calculate acceptance factor
    const acceptanceFactor = ((pm - pf) / (pm + 14.7));
    
    // Calculate required tank size
    const tankSize = expandedVolume / acceptanceFactor;

    setResult({
      tankSize: Math.ceil(tankSize), // Round up for safety
      acceptanceVolume: expandedVolume,
      expansionRate,
    });
  };

  const reset = () => {
    setSystemVolume('');
    setFillPressure('');
    setMaxPressure('');
    setFillTemp('');
    setMaxTemp('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Expansion Tank Sizer</h2>
        <p className="text-gray-600">Calculate required expansion tank size for closed hydronic systems</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            System Water Volume (gallons)
          </label>
          <input
            type="number"
            placeholder="Enter system volume"
            value={systemVolume}
            onChange={(e) => setSystemVolume(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Total water in boiler, piping, and radiators</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fill Pressure (psi)
          </label>
          <input
            type="number"
            placeholder="Enter fill pressure"
            value={fillPressure}
            onChange={(e) => setFillPressure(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Typically 12-15 psi for residential systems</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum System Pressure (psi)
          </label>
          <input
            type="number"
            placeholder="Enter max pressure"
            value={maxPressure}
            onChange={(e) => setMaxPressure(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Relief valve setting (usually 30 psi residential)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fill Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter fill temp"
            value={fillTemp}
            onChange={(e) => setFillTemp(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Usually 50-70°F (cold fill water)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Operating Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter max temp"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Typically 180-200°F for boiler systems</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Tank Size
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
                <span className="font-medium">Minimum Tank Size:</span>
                <span className="text-2xl font-bold text-blue-700">
                  {result.tankSize} gallons
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Expansion Volume:</span>
                <span className="text-lg">{result.acceptanceVolume.toFixed(2)} gallons</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Expansion Rate:</span>
                <span className="text-lg">{result.expansionRate.toFixed(2)}%</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-300">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Choose the next standard size up from the calculated minimum.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Expansion Tank Sizing Guidelines:</h4>
          <ul className="space-y-1">
            <li>• Water expands approximately 2% per 100°F temperature rise</li>
            <li>• Closed systems require expansion tank to accept expanded volume</li>
            <li>• Tank must be sized for acceptance volume between fill and max pressure</li>
            <li>• Standard residential sizes: 2, 4.5, 8, 15, 30, 60 gallons</li>
            <li>• Always install with air cushion at top for proper operation</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm">
          <h4 className="font-semibold text-yellow-800 mb-2">System Volume Estimation:</h4>
          <ul className="space-y-1 text-yellow-700">
            <li>• Boiler: Typically 1-3 gallons per 100,000 BTU</li>
            <li>• Baseboard: 0.25 gallons per foot</li>
            <li>• Radiators: 1-2 gallons each (depending on size)</li>
            <li>• Piping: 1-2 gallons per 100 feet (varies by pipe size)</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Expansion Tank Sizer"
            category="hydronic"
            inputs={{ systemVolume, fillPressure, maxPressure, fillTemp, maxTemp }}
            results={{ tankSize: result.tankSize, acceptanceVolume: result.acceptanceVolume, expansionRate: result.expansionRate }}
          />
        )}
      </div>
    </div>
  );
}
