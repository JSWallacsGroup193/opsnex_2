import { useState } from 'react';
import { Refrigerant, saturationTempMap } from '../utils/refrigerantPTData';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function SuperheatCalculator() {
  const [suctionTemp, setSuctionTemp] = useState<number | ''>('');
  const [suctionPressure, setSuctionPressure] = useState<number | ''>('');
  const [refrigerant, setRefrigerant] = useState<Refrigerant>('R-410A');
  const [targetSH, setTargetSH] = useState<number>(10);
  const [result, setResult] = useState<{
    actualSH: number;
    satTemp: number;
    status: string;
    delta: number;
  } | null>(null);

  const calculate = () => {
    if (suctionTemp === '' || suctionPressure === '') {
      alert('Enter all fields');
      return;
    }

    const psig = Number(suctionPressure);
    const temp = Number(suctionTemp);

    const satTemp = saturationTempMap[refrigerant](psig);
    const actualSH = temp - satTemp;
    const delta = Math.abs(actualSH - targetSH);
    
    let status = '✅ Normal';
    if (delta > 5) {
      status = actualSH > targetSH ? '⚠️ High (Possible Undercharge)' : '⚠️ Low (Possible Overcharge)';
    }

    setResult({ actualSH, satTemp, status, delta });
  };

  const reset = () => {
    setSuctionTemp('');
    setSuctionPressure('');
    setRefrigerant('R-410A');
    setTargetSH(10);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Superheat Calculator</h2>
        <p className="text-gray-600">Calculate superheat for proper refrigerant charge diagnosis</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Refrigerant Type
          </label>
          <select
            value={refrigerant}
            onChange={(e) => setRefrigerant(e.target.value as Refrigerant)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="R-22">R-22</option>
            <option value="R-410A">R-410A</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suction Line Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter suction temp"
            value={suctionTemp}
            onChange={(e) => setSuctionTemp(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suction Pressure (psig)
          </label>
          <input
            type="number"
            placeholder="Enter suction pressure"
            value={suctionPressure}
            onChange={(e) => setSuctionPressure(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Superheat (°F)
          </label>
          <input
            type="number"
            placeholder="Target SH (typically 8-12°F)"
            value={targetSH}
            onChange={(e) => setTargetSH(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Superheat
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
            <div className={`p-4 rounded-md border ${result.delta <= 5 ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
              <h3 className="font-bold text-lg mb-3">Results:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Saturation Temperature:</span>
                  <span className="text-lg font-bold">{result.satTemp.toFixed(1)}°F</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Actual Superheat:</span>
                  <span className={`text-xl font-bold ${result.delta <= 5 ? 'text-green-700' : 'text-yellow-700'}`}>
                    {result.actualSH.toFixed(1)}°F
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Target:</span>
                  <span className="text-lg">{targetSH}°F</span>
                </div>

                <div className="pt-2 border-t border-gray-300">
                  <p className="font-medium mb-1">Status:</p>
                  <p className="text-lg">{result.status}</p>
                </div>
              </div>
            </div>

            <SaveToWorkOrder
              calculatorType="Superheat"
              category="refrigeration"
              inputs={{
                refrigerant,
                suctionTemp,
                suctionPressure,
                targetSH
              }}
              results={result}
            />
          </>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Superheat Reference:</h4>
          <ul className="space-y-1">
            <li>• Superheat = Suction Line Temp - Saturation Temp</li>
            <li>• Typical range: 8-12°F for fixed orifice systems</li>
            <li>• Low superheat (&lt;5°F) may indicate overcharge</li>
            <li>• High superheat (&gt;15°F) may indicate undercharge</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
