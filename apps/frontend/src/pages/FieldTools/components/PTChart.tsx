import { useState } from 'react';
import { refrigerantPTData, Refrigerant } from '../utils/refrigerantPTData';

export default function PTChart() {
  const [refrigerant, setRefrigerant] = useState<Refrigerant>('R-410A');
  const [filter, setFilter] = useState('');

  const data = refrigerantPTData[refrigerant].filter(
    (entry) =>
      entry.temp.toString().includes(filter) ||
      entry.pressure.toString().includes(filter)
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Refrigerant PT Chart</h2>
        <p className="text-gray-600">Pressure-Temperature reference chart for refrigerants</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Filter (Temp or Pressure)
            </label>
            <input
              type="text"
              placeholder="Filter values..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Temperature (°F)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Pressure (psig)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr 
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 border-b border-gray-200">
                      {row.temp}°F
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 font-medium">
                      {row.pressure} psig
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No results found for "{filter}"
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-md text-sm text-gray-700 border border-blue-200">
          <h4 className="font-semibold mb-2 text-blue-900">How to Use PT Chart:</h4>
          <ul className="space-y-1">
            <li>• Find saturation temperature for a given pressure</li>
            <li>• Verify gauge readings against expected values</li>
            <li>• Essential for superheat and subcooling calculations</li>
            <li>• Reference when diagnosing system performance</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-md text-xs text-gray-600">
          <p className="font-semibold mb-1">Note:</p>
          <p>
            These are approximate saturation values. Always consult manufacturer PT charts 
            for precise readings and complete temperature ranges.
          </p>
        </div>
      </div>
    </div>
  );
}
