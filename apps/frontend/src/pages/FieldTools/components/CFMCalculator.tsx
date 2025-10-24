import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function CFMCalculator() {
  const [btuh, setBtuh] = useState<number | ''>('');
  const [deltaT, setDeltaT] = useState<number | ''>('');
  const [result, setResult] = useState<{
    cfm: number;
    tons: number;
    status: string;
  } | null>(null);

  const calculate = () => {
    if (btuh === '' || deltaT === '') {
      alert('Enter both fields');
      return;
    }
    if (Number(deltaT) === 0) {
      alert('Temp rise (ΔT) cannot be 0');
      return;
    }

    const b = Number(btuh);
    const dt = Number(deltaT);
    const cfm = b / (1.08 * dt);
    const tons = b / 12000;

    let status = '✅ Normal';
    const cfmPerTon = cfm / tons;
    if (cfmPerTon < 350) {
      status = '⚠️ Low Airflow (< 350 CFM/ton)';
    } else if (cfmPerTon > 450) {
      status = '⚠️ High Airflow (> 450 CFM/ton)';
    }

    setResult({ cfm, tons, status });
  };

  const reset = () => {
    setBtuh('');
    setDeltaT('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">CFM Calculator</h2>
        <p className="text-gray-600">Calculate airflow (CFM) from system capacity and temperature rise</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            System Capacity (BTU/hr)
          </label>
          <input
            type="number"
            placeholder="Enter BTU/hr"
            value={btuh}
            onChange={(e) => setBtuh(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Example: 36,000 BTU/hr = 3 tons</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature Rise (ΔT in °F)
          </label>
          <input
            type="number"
            placeholder="Enter temp rise"
            value={deltaT}
            onChange={(e) => setDeltaT(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Supply temp - Return temp (typically 15-25°F)</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate CFM
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {result && (
          <>
            <div className={`p-4 rounded-md border ${
              result.status.includes('Normal') ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'
            }`}>
              <h3 className="font-bold text-lg mb-3">Results:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Required Airflow:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {result.cfm.toFixed(0)} CFM
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">System Size:</span>
                  <span className="text-lg font-bold">{result.tons.toFixed(1)} tons</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">CFM per Ton:</span>
                  <span className="text-lg">{(result.cfm / result.tons).toFixed(0)} CFM/ton</span>
                </div>

                <div className="pt-2 border-t border-gray-300">
                  <p className="font-medium mb-1">Status:</p>
                  <p className="text-lg">{result.status}</p>
                </div>
              </div>
            </div>

            <SaveToWorkOrder
              calculatorType="CFM Calculator"
              category="airflow"
              inputs={{
                btuh,
                deltaT
              }}
              results={result}
            />
          </>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">CFM Formula:</h4>
          <p className="mb-2">CFM = BTU/hr ÷ (1.08 × ΔT)</p>
          <ul className="space-y-1">
            <li>• Standard: 400 CFM per ton (±50 CFM)</li>
            <li>• 1.08 is the sensible heat factor for air</li>
            <li>• Typical ΔT: 15-25°F for cooling</li>
            <li>• Low CFM can cause freezing coils</li>
            <li>• High CFM reduces dehumidification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
