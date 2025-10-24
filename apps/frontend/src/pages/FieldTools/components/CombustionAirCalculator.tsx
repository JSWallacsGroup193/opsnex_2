import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function CombustionAirCalculator() {
  const [volume, setVolume] = useState<number | ''>('');
  const [btus, setBtus] = useState<number | ''>('');
  const [openings, setOpenings] = useState<number | ''>('');
  const [result, setResult] = useState<{
    required: number;
    available: number;
    status: string;
    needsOpenings: boolean;
  } | null>(null);

  const calculate = () => {
    if (volume === '' || btus === '' || openings === '') {
      alert('Enter all fields');
      return;
    }

    const v = Number(volume);
    const b = Number(btus);
    const o = Number(openings);

    // 50 cubic feet per 1000 BTU for confined space
    const airRequired = (b / 1000) * 50;
    
    // Check if space is "confined" (< required volume)
    const isConfined = v < airRequired;
    
    let status = '';
    let needsOpenings = false;

    if (!isConfined) {
      status = '✅ PASS - Unconfined Space (adequate volume)';
    } else if (o >= 2) {
      status = '✅ PASS - Openings to Adjacent Space (2+ openings present)';
    } else {
      status = '❌ FAIL - Confined Space with Insufficient Ventilation';
      needsOpenings = true;
    }

    setResult({
      required: airRequired,
      available: v,
      status,
      needsOpenings,
    });
  };

  const reset = () => {
    setVolume('');
    setBtus('');
    setOpenings('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Combustion Air Calculator</h2>
        <p className="text-gray-600">Calculate required combustion air for gas furnaces and water heaters</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Volume (cubic feet)
          </label>
          <input
            type="number"
            placeholder="Enter room volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Length × Width × Height (in feet)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total BTU Input (all appliances)
          </label>
          <input
            type="number"
            placeholder="Enter total BTUs"
            value={btus}
            onChange={(e) => setBtus(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Sum of furnace, water heater, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Openings to Adjacent Space
          </label>
          <input
            type="number"
            placeholder="Number of openings"
            value={openings}
            onChange={(e) => setOpenings(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Each opening must be ≥ 100 sq. in.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Evaluate
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-md border ${
            result.needsOpenings 
              ? 'bg-red-50 border-red-300' 
              : 'bg-green-50 border-green-300'
          }`}>
            <h3 className="font-bold text-lg mb-3">Results:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Required Volume:</span>
                <span className="text-lg font-bold">
                  {result.required.toFixed(0)} ft³
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Available Volume:</span>
                <span className="text-lg font-bold">
                  {result.available.toFixed(0)} ft³
                </span>
              </div>

              <div className="pt-2 border-t border-gray-300">
                <p className="font-medium mb-1">Status:</p>
                <p className={`text-lg ${result.needsOpenings ? 'text-red-700' : 'text-green-700'}`}>
                  {result.status}
                </p>
              </div>

              {result.needsOpenings && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="font-semibold text-red-800 mb-2">Required Action:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Add 2+ openings to adjacent unconfinedspace</li>
                    <li>• Each opening ≥ 100 sq. in. (10" × 10")</li>
                    <li>• One opening within 12" of ceiling</li>
                    <li>• One opening within 12" of floor</li>
                    <li>• Or install direct outdoor combustion air</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Combustion Air Requirements:</h4>
          <ul className="space-y-1">
            <li>• <strong>Unconfined space:</strong> ≥ 50 ft³ per 1000 BTU input</li>
            <li>• <strong>Confined space:</strong> Requires 2+ openings to adjacent space</li>
            <li>• Each opening must be ≥ 100 sq. in. (approximately 10" × 10")</li>
            <li>• Openings can be louvered doors, grilles, or ducts</li>
            <li>• Alternative: Direct outdoor air (2 openings or single opening)</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
          <h4 className="font-semibold mb-2 text-blue-900">What is Confined Space?</h4>
          <p className="text-blue-800">
            A <strong>confined space</strong> is any room with less than 50 cubic feet per 1000 BTU 
            of appliance input. Example: A 100,000 BTU furnace needs 5,000 ft³ (e.g., 10' × 10' × 50' room).
          </p>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Combustion Air Calculator"
            category="gas"
            inputs={{ roomVolume: volume, totalBTU: btus, numberOfOpenings: openings }}
            results={{ requiredVolume: result.required, availableVolume: result.available, status: result.status, needsOpenings: result.needsOpenings }}
          />
        )}
      </div>
    </div>
  );
}
