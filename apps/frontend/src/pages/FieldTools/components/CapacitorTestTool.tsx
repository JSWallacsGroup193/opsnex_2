import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function CapacitorTestTool() {
  const [rated, setRated] = useState<number | ''>('');
  const [measured, setMeasured] = useState<number | ''>('');
  const [status, setStatus] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState<number | null>(null);

  const testCapacitor = () => {
    if (rated === '' || measured === '') {
      alert('Please enter both values');
      return;
    }

    const ratedVal = Number(rated);
    const measuredVal = Number(measured);
    const toleranceValue = ratedVal * 0.10;
    const pass = measuredVal >= ratedVal - toleranceValue && measuredVal <= ratedVal + toleranceValue;
    const result = pass ? 'PASS' : 'FAIL';
    
    setStatus(result);
    setTolerance(toleranceValue);
  };

  const reset = () => {
    setRated('');
    setMeasured('');
    setStatus(null);
    setTolerance(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Capacitor Test Tool</h2>
        <p className="text-gray-600">Test capacitors with ±10% tolerance</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rated Capacitance (µF)
          </label>
          <input
            type="number"
            placeholder="Enter rated µF"
            value={rated}
            onChange={(e) => setRated(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Measured Capacitance (µF)
          </label>
          <input
            type="number"
            placeholder="Enter measured µF"
            value={measured}
            onChange={(e) => setMeasured(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={testCapacitor}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Test Capacitor
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {status && (
          <div className={`p-4 rounded-md ${status === 'PASS' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <h3 className="font-bold text-lg mb-2">Test Result:</h3>
            <div className={`text-2xl font-bold ${status === 'PASS' ? 'text-green-700' : 'text-red-700'}`}>
              {status}
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p>Tolerance Range: ±{tolerance?.toFixed(2)} µF</p>
              <p>Acceptable Range: {(Number(rated) - (tolerance || 0)).toFixed(2)} - {(Number(rated) + (tolerance || 0)).toFixed(2)} µF</p>
              <p>Measured Value: {measured} µF</p>
            </div>
          </div>
        )}

        {status && (
          <SaveToWorkOrder
            calculatorType="Capacitor Test"
            category="electrical"
            inputs={{ ratedCapacitance: rated, measuredCapacitance: measured }}
            results={{ status, tolerance, acceptableRange: { min: Number(rated) - (tolerance || 0), max: Number(rated) + (tolerance || 0) } }}
          />
        )}
      </div>
    </div>
  );
}
