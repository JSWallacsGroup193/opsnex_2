import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function StaticPressureTool() {
  const [supply, setSupply] = useState<number | ''>('');
  const [returnP, setReturnP] = useState<number | ''>('');
  const [result, setResult] = useState<{
    totalESP: number;
    status: string;
  } | null>(null);

  const calculate = () => {
    if (supply === '' || returnP === '') {
      alert('Enter both pressure values');
      return;
    }

    const totalESP = Math.abs(Number(supply)) + Math.abs(Number(returnP));

    let status = '✅ Normal Range';
    if (totalESP < 0.3) {
      status = '⚠️ Low Pressure (< 0.3" wc) - Check for oversized ductwork';
    } else if (totalESP > 0.8) {
      status = '🔴 High Pressure (> 0.8" wc) - System restriction detected';
    }

    setResult({ totalESP, status });
  };

  const reset = () => {
    setSupply('');
    setReturnP('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Static Pressure Tool</h2>
        <p className="text-gray-600">Calculate total external static pressure (ESP) for system diagnostics</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supply Pressure (in. wc)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter supply pressure"
            value={supply}
            onChange={(e) => setSupply(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Measure at supply plenum (typically 0.2-0.6" wc)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Pressure (in. wc)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter return pressure"
            value={returnP}
            onChange={(e) => setReturnP(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Measure at return plenum (typically 0.1-0.3" wc)</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate ESP
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
            result.totalESP <= 0.8 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <h3 className="font-bold text-lg mb-3">Results:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total External Static Pressure:</span>
                <span className={`text-2xl font-bold ${
                  result.totalESP <= 0.8 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.totalESP.toFixed(3)} in. wc
                </span>
              </div>

              <div className="pt-2 border-t border-gray-300">
                <p className="font-medium mb-1">Status:</p>
                <p className="text-lg">{result.status}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Static Pressure Guidelines:</h4>
          <ul className="space-y-1">
            <li>• Total ESP = Supply Pressure + Return Pressure</li>
            <li>• Normal Range: 0.3 - 0.8 inches water column</li>
            <li>• Optimal: 0.5 inches wc or less</li>
            <li>• High ESP causes: Dirty filter, closed dampers, undersized ducts</li>
            <li>• Low ESP causes: Oversized ductwork, duct leaks</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-md text-sm border border-blue-200">
          <h4 className="font-semibold mb-2 text-blue-900">Measurement Tips:</h4>
          <ul className="space-y-1 text-blue-800">
            <li>• Use a manometer or magnehelic gauge</li>
            <li>• Take measurements with system running</li>
            <li>• Supply pressure is usually negative (-) value</li>
            <li>• Return pressure is usually negative (-) value</li>
            <li>• Always use absolute values for ESP calculation</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Static Pressure Tool"
            category="airflow"
            inputs={{ supplyPressure: supply, returnPressure: returnP }}
            results={{ totalESP: result.totalESP, status: result.status }}
          />
        )}
      </div>
    </div>
  );
}
