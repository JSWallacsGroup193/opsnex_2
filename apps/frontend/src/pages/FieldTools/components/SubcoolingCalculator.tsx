import { useState } from 'react';
import { Refrigerant, saturationTempMap } from '../utils/refrigerantPTData';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function SubcoolingCalculator() {
  const [liquidTemp, setLiquidTemp] = useState<number | ''>('');
  const [liquidPressure, setLiquidPressure] = useState<number | ''>('');
  const [refrigerant, setRefrigerant] = useState<Refrigerant>('R-410A');
  const [result, setResult] = useState<{
    subcool: number;
    satTemp: number;
    status: string;
  } | null>(null);

  const calculate = () => {
    if (liquidTemp === '' || liquidPressure === '') {
      alert('Enter all fields');
      return;
    }

    const psig = Number(liquidPressure);
    const temp = Number(liquidTemp);
    const satTemp = saturationTempMap[refrigerant](psig);
    const subcool = satTemp - temp;
    
    const status =
      subcool >= 8 && subcool <= 12
        ? '✅ Normal (8-12°F range)'
        : subcool < 8
        ? '⚠️ Low (Possible Undercharge)'
        : '⚠️ High (Possible Overcharge)';

    setResult({ subcool, satTemp, status });
  };

  const reset = () => {
    setLiquidTemp('');
    setLiquidPressure('');
    setRefrigerant('R-410A');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Subcooling Calculator</h2>
        <p className="text-gray-600">Calculate subcooling for proper refrigerant charge verification</p>
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
            Liquid Line Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter liquid line temp"
            value={liquidTemp}
            onChange={(e) => setLiquidTemp(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Liquid Pressure (psig)
          </label>
          <input
            type="number"
            placeholder="Enter liquid pressure"
            value={liquidPressure}
            onChange={(e) => setLiquidPressure(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Subcooling
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
            result.subcool >= 8 && result.subcool <= 12
              ? 'bg-green-50 border-green-300'
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <h3 className="font-bold text-lg mb-3">Results:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Saturation Temperature:</span>
                <span className="text-lg font-bold">{result.satTemp.toFixed(1)}°F</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Subcooling:</span>
                <span className={`text-xl font-bold ${
                  result.subcool >= 8 && result.subcool <= 12
                    ? 'text-green-700'
                    : 'text-yellow-700'
                }`}>
                  {result.subcool.toFixed(1)}°F
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
          <h4 className="font-semibold mb-2">Subcooling Reference:</h4>
          <ul className="space-y-1">
            <li>• Subcooling = Saturation Temp - Liquid Line Temp</li>
            <li>• Typical range: 8-12°F for most systems</li>
            <li>• Low subcooling (&lt;8°F) may indicate undercharge</li>
            <li>• High subcooling (&gt;15°F) may indicate overcharge or restriction</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Subcooling Calculator"
            category="refrigeration"
            inputs={{ liquidTemp, liquidPressure, refrigerant }}
            results={{ subcooling: result.subcool, saturationTemp: result.satTemp, status: result.status }}
          />
        )}
      </div>
    </div>
  );
}
