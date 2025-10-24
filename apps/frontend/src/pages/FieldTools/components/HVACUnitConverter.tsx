import { useState } from 'react';

type UnitCategory = 'temperature' | 'pressure' | 'flow' | 'energy' | 'power';

interface UnitOption {
  label: string;
  value: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const unitCategories: Record<UnitCategory, { name: string; units: UnitOption[] }> = {
  temperature: {
    name: 'Temperature',
    units: [
      { label: '°F', value: 'f', toBase: (v) => v, fromBase: (v) => v },
      { label: '°C', value: 'c', toBase: (v) => (v * 9/5) + 32, fromBase: (v) => (v - 32) * 5/9 },
      { label: 'K', value: 'k', toBase: (v) => (v * 9/5) - 459.67, fromBase: (v) => (v + 459.67) * 5/9 },
    ]
  },
  pressure: {
    name: 'Pressure',
    units: [
      { label: 'PSI', value: 'psi', toBase: (v) => v, fromBase: (v) => v },
      { label: 'in.wc', value: 'inwc', toBase: (v) => v * 0.0361, fromBase: (v) => v / 0.0361 },
      { label: 'Pa', value: 'pa', toBase: (v) => v * 0.000145038, fromBase: (v) => v / 0.000145038 },
      { label: 'kPa', value: 'kpa', toBase: (v) => v * 0.145038, fromBase: (v) => v / 0.145038 },
      { label: 'bar', value: 'bar', toBase: (v) => v * 14.5038, fromBase: (v) => v / 14.5038 },
    ]
  },
  flow: {
    name: 'Air Flow',
    units: [
      { label: 'CFM', value: 'cfm', toBase: (v) => v, fromBase: (v) => v },
      { label: 'L/s', value: 'lps', toBase: (v) => v * 2.11888, fromBase: (v) => v / 2.11888 },
      { label: 'm³/h', value: 'm3h', toBase: (v) => v * 0.588578, fromBase: (v) => v / 0.588578 },
      { label: 'FPM', value: 'fpm', toBase: (v) => v, fromBase: (v) => v },
    ]
  },
  energy: {
    name: 'Energy',
    units: [
      { label: 'BTU', value: 'btu', toBase: (v) => v, fromBase: (v) => v },
      { label: 'kWh', value: 'kwh', toBase: (v) => v * 3412.14, fromBase: (v) => v / 3412.14 },
      { label: 'Joules', value: 'j', toBase: (v) => v * 0.000947817, fromBase: (v) => v / 0.000947817 },
      { label: 'kJ', value: 'kj', toBase: (v) => v * 0.947817, fromBase: (v) => v / 0.947817 },
    ]
  },
  power: {
    name: 'Power',
    units: [
      { label: 'BTU/hr', value: 'btuh', toBase: (v) => v, fromBase: (v) => v },
      { label: 'Watts', value: 'w', toBase: (v) => v * 3.41214, fromBase: (v) => v / 3.41214 },
      { label: 'kW', value: 'kw', toBase: (v) => v * 3412.14, fromBase: (v) => v / 3412.14 },
      { label: 'Tons', value: 'tons', toBase: (v) => v * 12000, fromBase: (v) => v / 12000 },
      { label: 'HP', value: 'hp', toBase: (v) => v * 2544.43, fromBase: (v) => v / 2544.43 },
    ]
  },
};

export default function HVACUnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('temperature');
  const [fromUnit, setFromUnit] = useState('f');
  const [toUnit, setToUnit] = useState('c');
  const [inputValue, setInputValue] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    const units = unitCategories[newCategory].units;
    setFromUnit(units[0].value);
    setToUnit(units[1].value);
    setResult(null);
  };

  const convert = () => {
    if (inputValue === '') {
      alert('Enter a value');
      return;
    }

    const value = Number(inputValue);
    const categoryData = unitCategories[category];
    const fromUnitData = categoryData.units.find(u => u.value === fromUnit);
    const toUnitData = categoryData.units.find(u => u.value === toUnit);

    if (!fromUnitData || !toUnitData) {
      alert('Invalid units selected');
      return;
    }

    const baseValue = fromUnitData.toBase(value);
    const convertedValue = toUnitData.fromBase(baseValue);
    setResult(convertedValue);
  };

  const reset = () => {
    setInputValue('');
    setResult(null);
  };

  const currentCategory = unitCategories[category];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">HVAC Unit Converter</h2>
        <p className="text-gray-600">Convert between common HVAC units of measurement</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(unitCategories) as UnitCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {unitCategories[cat].name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Unit
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currentCategory.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Unit
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currentCategory.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value to Convert
          </label>
          <input
            type="number"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={convert}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Convert
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {result !== null && (
          <div className="p-4 rounded-md bg-green-50 border border-green-300">
            <h3 className="font-bold text-lg mb-2">Conversion Result:</h3>
            <div className="text-2xl font-bold text-green-700">
              {result.toFixed(4)} {currentCategory.units.find(u => u.value === toUnit)?.label}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {inputValue} {currentCategory.units.find(u => u.value === fromUnit)?.label} = {result.toFixed(4)} {currentCategory.units.find(u => u.value === toUnit)?.label}
            </p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Common HVAC Conversions:</h4>
          <ul className="space-y-1">
            <li>• <strong>Temperature:</strong> °F = (°C × 9/5) + 32</li>
            <li>• <strong>Pressure:</strong> 1 PSI = 27.7 in.wc = 6,895 Pa</li>
            <li>• <strong>Flow:</strong> 1 CFM = 0.472 L/s = 1.699 m³/h</li>
            <li>• <strong>Energy:</strong> 1 kWh = 3,412 BTU</li>
            <li>• <strong>Power:</strong> 1 Ton = 12,000 BTU/hr = 3.517 kW</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
