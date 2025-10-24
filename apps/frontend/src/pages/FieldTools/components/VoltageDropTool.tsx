import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

const COPPER_RESISTIVITY = 12.9;

export default function VoltageDropTool() {
  const [voltage, setVoltage] = useState<number | ''>('');
  const [amps, setAmps] = useState<number | ''>('');
  const [distance, setDistance] = useState<number | ''>('');
  const [phase, setPhase] = useState<'1' | '3'>('1');
  const [result, setResult] = useState<{
    vd: string;
    vdPct: string;
    wire: string;
    acceptable: boolean;
  } | null>(null);

  const calculateDrop = () => {
    if ([voltage, amps, distance].includes('')) {
      alert('Please enter all fields');
      return;
    }

    const volt = Number(voltage);
    const amp = Number(amps);
    const dist = Number(distance);

    const multiplier = phase === '1' ? 2 : 1.732;
    const vd = (multiplier * amp * dist * COPPER_RESISTIVITY) / 1000;
    const vdPct = (vd / volt) * 100;

    const acceptable = vdPct <= 3;
    const wireRecommendation = acceptable 
      ? '14 AWG or larger' 
      : `Upgrade wire size (${vdPct.toFixed(1)}% > 3% limit)`;

    setResult({
      vd: vd.toFixed(2),
      vdPct: vdPct.toFixed(2),
      wire: wireRecommendation,
      acceptable
    });
  };

  const reset = () => {
    setVoltage('');
    setAmps('');
    setDistance('');
    setPhase('1');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Voltage Drop / Wire Size Calculator</h2>
        <p className="text-gray-600">Calculate voltage drop and determine wire size requirements</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Voltage (V)
          </label>
          <input
            type="number"
            placeholder="Enter voltage"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current (Amps)
          </label>
          <input
            type="number"
            placeholder="Enter amps"
            value={amps}
            onChange={(e) => setAmps(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            One-way Distance (feet)
          </label>
          <input
            type="number"
            placeholder="Enter distance in feet"
            value={distance}
            onChange={(e) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phase
          </label>
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value as '1' | '3')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">Single Phase</option>
            <option value="3">Three Phase</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculateDrop}
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
          <div className={`p-4 rounded-md border ${result.acceptable ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'}`}>
            <h3 className="font-bold text-lg mb-3">Calculation Results:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Voltage Drop:</span>
                <span className="text-xl font-bold">{result.vd} V</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Percentage Drop:</span>
                <span className={`text-xl font-bold ${result.acceptable ? 'text-green-700' : 'text-yellow-700'}`}>
                  {result.vdPct}%
                </span>
              </div>

              <div className="pt-2 border-t border-gray-300">
                <p className="font-medium mb-1">Wire Recommendation:</p>
                <p className={`text-lg ${result.acceptable ? 'text-green-700' : 'text-yellow-700'}`}>
                  {result.wire}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-300 text-sm text-gray-700">
                <p><strong>System Voltage:</strong> {voltage} V</p>
                <p><strong>Current:</strong> {amps} A</p>
                <p><strong>Distance:</strong> {distance} ft</p>
                <p><strong>Phase:</strong> {phase === '1' ? 'Single Phase' : 'Three Phase'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">NEC Guidelines:</h4>
          <ul className="space-y-1">
            <li>• Maximum voltage drop: <strong>3%</strong> for branch circuits</li>
            <li>• Maximum voltage drop: <strong>5%</strong> total (feeder + branch)</li>
            <li>• Based on copper wire at 75°C</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Voltage Drop Calculator"
            category="electrical"
            inputs={{ voltage, amps, distance, phase }}
            results={{ voltageDrop: result.vd, percentageDrop: result.vdPct, wireRecommendation: result.wire, acceptable: result.acceptable }}
          />
        )}
      </div>
    </div>
  );
}
