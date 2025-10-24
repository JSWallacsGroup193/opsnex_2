import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

type DuctShape = 'round' | 'rectangular';

export default function DuctSizer() {
  const [cfm, setCfm] = useState<number | ''>('');
  const [velocity, setVelocity] = useState<number | ''>('');
  const [shape, setShape] = useState<DuctShape>('round');
  const [result, setResult] = useState<{
    area: number;
    diameter?: number;
    width?: number;
    height?: number;
    velocityStatus: string;
  } | null>(null);

  const calculate = () => {
    if (cfm === '' || velocity === '') {
      alert('Enter all fields');
      return;
    }

    const c = Number(cfm);
    const v = Number(velocity);
    const area = c / v;

    let dims: any = {};

    if (shape === 'round') {
      const diameter = Math.sqrt((4 * area) / Math.PI) * 12;
      dims = { diameter };
    } else {
      const width = Math.sqrt(area) * 12;
      const height = width * 0.75;
      dims = { width, height };
    }

    let velocityStatus = '✅ Normal Velocity';
    if (v < 600) {
      velocityStatus = '⚠️ Low Velocity (< 600 FPM) - May cause noise issues';
    } else if (v > 900) {
      velocityStatus = '⚠️ High Velocity (> 900 FPM) - Excessive noise/pressure drop';
    }

    setResult({
      area,
      ...dims,
      velocityStatus,
    });
  };

  const reset = () => {
    setCfm('');
    setVelocity('');
    setShape('round');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Duct Sizer</h2>
        <p className="text-gray-600">Calculate required duct dimensions based on airflow and velocity</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Airflow (CFM)
          </label>
          <input
            type="number"
            placeholder="Enter CFM"
            value={cfm}
            onChange={(e) => setCfm(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Air Velocity (FPM - Feet Per Minute)
          </label>
          <input
            type="number"
            placeholder="Enter velocity"
            value={velocity}
            onChange={(e) => setVelocity(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 600-900 FPM for supply ducts</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duct Shape
          </label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value as DuctShape)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="round">Round Duct</option>
            <option value="rectangular">Rectangular Duct</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Size
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
            <h3 className="font-bold text-lg mb-3">Recommended Duct Size:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Cross-Sectional Area:</span>
                <span className="text-lg font-bold">{result.area.toFixed(2)} ft²</span>
              </div>

              {result.diameter && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Round Duct Diameter:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {result.diameter.toFixed(1)} inches
                  </span>
                </div>
              )}

              {result.width && result.height && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rectangular Width:</span>
                    <span className="text-xl font-bold text-blue-700">
                      {result.width.toFixed(1)} inches
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rectangular Height:</span>
                    <span className="text-xl font-bold text-blue-700">
                      {result.height.toFixed(1)} inches
                    </span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-blue-300">
                <p className="font-medium mb-1">Velocity Check:</p>
                <p className="text-sm">{result.velocityStatus}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Velocity Guidelines:</h4>
          <ul className="space-y-1">
            <li>• Supply Trunks: 700-900 FPM</li>
            <li>• Supply Branches: 600-700 FPM</li>
            <li>• Return Trunks: 600-800 FPM</li>
            <li>• Return Branches: 500-600 FPM</li>
            <li>• Higher velocity = smaller duct but more noise</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Duct Sizer"
            category="airflow"
            inputs={{ cfm, velocity, shape }}
            results={{ area: result.area, diameter: result.diameter, width: result.width, height: result.height, velocityStatus: result.velocityStatus }}
          />
        )}
      </div>
    </div>
  );
}
