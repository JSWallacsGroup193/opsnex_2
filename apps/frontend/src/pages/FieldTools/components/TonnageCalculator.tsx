import { useState } from 'react';

type ConversionMode = 'btu-to-tons' | 'tons-to-btu';

export default function TonnageCalculator() {
  const [mode, setMode] = useState<ConversionMode>('btu-to-tons');
  const [inputValue, setInputValue] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (inputValue === '') {
      alert('Enter a value');
      return;
    }

    const value = Number(inputValue);

    if (mode === 'btu-to-tons') {
      setResult(value / 12000);
    } else {
      setResult(value * 12000);
    }
  };

  const reset = () => {
    setInputValue('');
    setResult(null);
  };

  const getSizeCategory = (tons: number): string => {
    if (tons < 1.5) return 'Small (1-1.5 tons) - Small room, office';
    if (tons < 2.5) return 'Medium (1.5-2.5 tons) - Bedroom, small apartment';
    if (tons < 3.5) return 'Standard (2.5-3.5 tons) - Average home';
    if (tons < 5) return 'Large (3.5-5 tons) - Large home, commercial space';
    return 'Commercial (5+ tons) - Large building, multi-zone';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tonnage Calculator</h2>
        <p className="text-gray-600">Convert between BTU/hr and tons of cooling capacity</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conversion Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => { setMode('btu-to-tons'); setResult(null); }}
              className={`flex-1 px-4 py-2 rounded-md font-medium ${
                mode === 'btu-to-tons'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              BTU → Tons
            </button>
            <button
              onClick={() => { setMode('tons-to-btu'); setResult(null); }}
              className={`flex-1 px-4 py-2 rounded-md font-medium ${
                mode === 'tons-to-btu'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tons → BTU
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'btu-to-tons' ? 'BTU/hr Capacity' : 'Tons of Cooling'}
          </label>
          <input
            type="number"
            placeholder={mode === 'btu-to-tons' ? 'Enter BTU/hr' : 'Enter tons'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'btu-to-tons' 
              ? 'Example: 36000 BTU/hr = 3 tons' 
              : 'Example: 3 tons = 36000 BTU/hr'}
          </p>
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

        {result !== null && (
          <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-lg mb-3">Result:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {mode === 'btu-to-tons' ? 'Tonnage:' : 'BTU/hr:'}
                </span>
                <span className="text-2xl font-bold text-blue-700">
                  {mode === 'btu-to-tons' 
                    ? `${result.toFixed(2)} tons`
                    : `${result.toLocaleString()} BTU/hr`
                  }
                </span>
              </div>

              {mode === 'btu-to-tons' && (
                <div className="pt-2 border-t border-blue-300">
                  <p className="font-medium mb-1">Equipment Category:</p>
                  <p className="text-sm">{getSizeCategory(result)}</p>
                </div>
              )}

              {mode === 'tons-to-btu' && (
                <div className="pt-2 border-t border-blue-300">
                  <p className="text-sm">
                    💡 <strong>Cooling CFM:</strong> Approximately {Math.round(result / 2.5).toLocaleString()} CFM
                    <br />
                    <span className="text-xs text-gray-600">(Based on 400 CFM per ton rule of thumb)</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Tonnage Conversion:</h4>
          <ul className="space-y-1">
            <li>• <strong>1 Ton</strong> = 12,000 BTU/hr of cooling capacity</li>
            <li>• Named after the cooling provided by melting 1 ton of ice in 24 hours</li>
            <li>• Standard residential sizes: 1.5, 2, 2.5, 3, 3.5, 4, 5 tons</li>
            <li>• Rule of thumb: 400-600 CFM per ton (varies by climate)</li>
            <li>• Oversizing reduces efficiency and comfort (short cycling)</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
          <h4 className="font-semibold mb-2 text-blue-900">Common Equipment Sizes:</h4>
          <div className="grid grid-cols-2 gap-2 text-blue-800">
            <div>
              <strong>1.5 tons</strong> - 18,000 BTU
            </div>
            <div>
              <strong>2 tons</strong> - 24,000 BTU
            </div>
            <div>
              <strong>2.5 tons</strong> - 30,000 BTU
            </div>
            <div>
              <strong>3 tons</strong> - 36,000 BTU
            </div>
            <div>
              <strong>3.5 tons</strong> - 42,000 BTU
            </div>
            <div>
              <strong>4 tons</strong> - 48,000 BTU
            </div>
            <div>
              <strong>5 tons</strong> - 60,000 BTU
            </div>
            <div>
              <strong>7.5 tons</strong> - 90,000 BTU
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
