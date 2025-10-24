import { useState } from 'react';
import { calculateDewPoint, calculateWetBulb } from '../utils/psychrometricUtils';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function PsychrometricCalculator() {
  const [dryBulb, setDryBulb] = useState<number | ''>('');
  const [relativeHumidity, setRelativeHumidity] = useState<number | ''>('');
  const [result, setResult] = useState<{
    dewPoint: number;
    wetBulb: number;
    grainsMoisture: number;
    enthalpy: number;
  } | null>(null);

  const calculate = () => {
    if (dryBulb === '' || relativeHumidity === '') {
      alert('Enter both temperature and humidity');
      return;
    }

    const db = Number(dryBulb);
    const rh = Number(relativeHumidity);

    if (rh < 0 || rh > 100) {
      alert('Relative humidity must be between 0-100%');
      return;
    }

    const dewPoint = calculateDewPoint(db, rh);
    const wetBulb = calculateWetBulb(db, rh);
    
    const dewPointC = (dewPoint - 32) * (5 / 9);
    const vaporPressure = 6.112 * Math.exp((17.67 * dewPointC) / (dewPointC + 243.5));
    const grainsMoisture = (0.622 * vaporPressure * 7000) / (14.7 - vaporPressure);
    
    const enthalpy = 0.24 * db + (grainsMoisture / 7000) * (1061 + 0.444 * db);

    setResult({
      dewPoint,
      wetBulb,
      grainsMoisture,
      enthalpy,
    });
  };

  const reset = () => {
    setDryBulb('');
    setRelativeHumidity('');
    setResult(null);
  };

  const getComfortLevel = (db: number, rh: number): { level: string; color: string; message: string } => {
    if (rh < 30) {
      return { level: 'Too Dry', color: 'text-yellow-700', message: 'May cause dry skin, static electricity' };
    } else if (rh > 60) {
      return { level: 'Too Humid', color: 'text-red-700', message: 'May promote mold growth, discomfort' };
    } else if (db >= 68 && db <= 76 && rh >= 30 && rh <= 60) {
      return { level: 'Ideal Comfort', color: 'text-green-700', message: 'Optimal ASHRAE comfort zone' };
    } else if (db < 68) {
      return { level: 'Cool', color: 'text-blue-700', message: 'Below comfort temperature' };
    } else {
      return { level: 'Warm', color: 'text-orange-700', message: 'Above comfort temperature' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Psychrometric Calculator</h2>
        <p className="text-gray-600">Calculate dew point, wet bulb, and humidity properties</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dry Bulb Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter temperature"
            value={dryBulb}
            onChange={(e) => setDryBulb(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Actual air temperature measured with standard thermometer</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relative Humidity (%)
          </label>
          <input
            type="number"
            placeholder="Enter humidity %"
            value={relativeHumidity}
            onChange={(e) => setRelativeHumidity(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Percentage of moisture in air (0-100%)</p>
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

        {result && dryBulb !== '' && relativeHumidity !== '' && (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-lg mb-3">Psychrometric Properties:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dew Point:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {result.dewPoint.toFixed(1)}°F
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Wet Bulb:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {result.wetBulb.toFixed(1)}°F
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Moisture Content:</span>
                  <span className="text-lg">{result.grainsMoisture.toFixed(1)} grains/lb</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Enthalpy:</span>
                  <span className="text-lg">{result.enthalpy.toFixed(2)} BTU/lb</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-md ${
              getComfortLevel(Number(dryBulb), Number(relativeHumidity)).level === 'Ideal Comfort' 
                ? 'bg-green-50 border-green-300' 
                : 'bg-yellow-50 border-yellow-300'
            } border`}>
              <h3 className="font-bold mb-2">Comfort Assessment:</h3>
              <div className={`text-lg font-bold ${getComfortLevel(Number(dryBulb), Number(relativeHumidity)).color}`}>
                {getComfortLevel(Number(dryBulb), Number(relativeHumidity)).level}
              </div>
              <p className="text-sm mt-1">
                {getComfortLevel(Number(dryBulb), Number(relativeHumidity)).message}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Psychrometric Terms Explained:</h4>
          <ul className="space-y-1">
            <li>• <strong>Dry Bulb:</strong> Actual air temperature (standard thermometer)</li>
            <li>• <strong>Wet Bulb:</strong> Temperature with evaporative cooling effect</li>
            <li>• <strong>Dew Point:</strong> Temperature where condensation begins</li>
            <li>• <strong>Moisture Content:</strong> Water vapor in air (grains per pound)</li>
            <li>• <strong>Enthalpy:</strong> Total heat energy in air (sensible + latent)</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
          <h4 className="font-semibold mb-2 text-blue-900">ASHRAE Comfort Guidelines:</h4>
          <ul className="space-y-1 text-blue-800">
            <li>• <strong>Temperature:</strong> 68-76°F (winter), 73-79°F (summer)</li>
            <li>• <strong>Humidity:</strong> 30-60% RH for comfort and health</li>
            <li>• <strong>Dew Point:</strong> Below 60°F feels comfortable, above 65°F feels muggy</li>
            <li>• <strong>Application:</strong> Use for AC sizing, dehumidification needs, comfort analysis</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Psychrometric Calculator"
            category="utilities"
            inputs={{ dryBulb, relativeHumidity }}
            results={{ dewPoint: result.dewPoint, wetBulb: result.wetBulb, grainsMoisture: result.grainsMoisture, enthalpy: result.enthalpy }}
          />
        )}
      </div>
    </div>
  );
}
