import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function OhmsLawCalculator() {
  const [V, setV] = useState<number | ''>('');
  const [I, setI] = useState<number | ''>('');
  const [R, setR] = useState<number | ''>('');
  const [result, setResult] = useState<{
    V: number;
    I: number;
    R: number;
    P: number;
  } | null>(null);

  const calculate = () => {
    const values = [V, I, R].filter(val => val !== '');
    if (values.length !== 2) {
      alert('Please enter exactly two values');
      return;
    }

    let v = V !== '' ? Number(V) : undefined;
    let i = I !== '' ? Number(I) : undefined;
    let r = R !== '' ? Number(R) : undefined;

    if (v === undefined && i !== undefined && r !== undefined) v = i * r;
    if (i === undefined && v !== undefined && r !== undefined) i = v / r;
    if (r === undefined && v !== undefined && i !== undefined) r = v / i;

    if (v !== undefined && i !== undefined && r !== undefined) {
      const P = v * i;
      setResult({ V: v, I: i, R: r, P });
    }
  };

  const reset = () => {
    setV('');
    setI('');
    setR('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ohm's Law Calculator</h2>
        <p className="text-gray-600">Calculate voltage, current, resistance, and power (enter any 2 values)</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Voltage (V) - Volts
          </label>
          <input
            type="number"
            placeholder="Enter voltage"
            value={V}
            onChange={(e) => setV(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current (I) - Amps
          </label>
          <input
            type="number"
            placeholder="Enter current"
            value={I}
            onChange={(e) => setI(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resistance (R) - Ohms
          </label>
          <input
            type="number"
            placeholder="Enter resistance"
            value={R}
            onChange={(e) => setR(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate
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
            <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-lg mb-3 text-blue-900">Calculation Results:</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded border border-blue-100">
                  <div className="text-sm text-gray-600">Voltage (V)</div>
                  <div className="text-2xl font-bold text-blue-700">{result.V.toFixed(2)} V</div>
                </div>

                <div className="bg-white p-3 rounded border border-blue-100">
                  <div className="text-sm text-gray-600">Current (I)</div>
                  <div className="text-2xl font-bold text-blue-700">{result.I.toFixed(2)} A</div>
                </div>

                <div className="bg-white p-3 rounded border border-blue-100">
                  <div className="text-sm text-gray-600">Resistance (R)</div>
                  <div className="text-2xl font-bold text-blue-700">{result.R.toFixed(2)} Ω</div>
                </div>

                <div className="bg-white p-3 rounded border border-blue-100">
                  <div className="text-sm text-gray-600">Power (P)</div>
                  <div className="text-2xl font-bold text-blue-700">{result.P.toFixed(2)} W</div>
                </div>
              </div>
            </div>

            <SaveToWorkOrder
              calculatorType="Ohm's Law"
              category="electrical"
              inputs={{ voltage: V, current: I, resistance: R }}
              results={result}
            />
          </>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Ohm's Law Formulas:</h4>
          <ul className="space-y-1">
            <li>• <strong>V = I × R</strong> (Voltage = Current × Resistance)</li>
            <li>• <strong>I = V ÷ R</strong> (Current = Voltage ÷ Resistance)</li>
            <li>• <strong>R = V ÷ I</strong> (Resistance = Voltage ÷ Current)</li>
            <li>• <strong>P = V × I</strong> (Power = Voltage × Current)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
