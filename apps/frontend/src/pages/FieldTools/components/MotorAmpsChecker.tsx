import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

export default function MotorAmpsChecker() {
  const [measured, setMeasured] = useState<number | ''>('');
  const [rla, setRla] = useState<number | ''>('');
  const [loadPercent, setLoadPercent] = useState<number | null>(null);
  const [status, setStatus] = useState<'green' | 'yellow' | 'red' | null>(null);

  const checkLoad = () => {
    if (measured === '' || rla === '') {
      alert('Please enter both values');
      return;
    }

    const percent = (Number(measured) / Number(rla)) * 100;
    setLoadPercent(percent);

    let loadStatus: 'green' | 'yellow' | 'red' = 'green';
    if (percent >= 90 && percent <= 100) loadStatus = 'yellow';
    if (percent > 100) loadStatus = 'red';
    setStatus(loadStatus);
  };

  const reset = () => {
    setMeasured('');
    setRla('');
    setLoadPercent(null);
    setStatus(null);
  };

  const getStatusMessage = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return { text: 'Normal', description: 'Motor is operating within safe parameters' };
      case 'yellow':
        return { text: 'Warning', description: 'Motor is approaching maximum load' };
      case 'red':
        return { text: 'Overload', description: 'Motor is overloaded - immediate attention required' };
    }
  };

  const statusColors = {
    green: 'bg-green-100 border-green-300 text-green-800',
    yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    red: 'bg-red-100 border-red-300 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Motor Amps Checker</h2>
        <p className="text-gray-600">Check motor load percentage against rated amperage</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Measured Amps
          </label>
          <input
            type="number"
            placeholder="Enter measured amps"
            value={measured}
            onChange={(e) => setMeasured(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RLA / FLA (Rated Load Amps)
          </label>
          <input
            type="number"
            placeholder="Enter RLA/FLA"
            value={rla}
            onChange={(e) => setRla(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={checkLoad}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Check Load
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>

        {loadPercent !== null && status && (
          <div className={`p-4 rounded-md border ${statusColors[status]}`}>
            <h3 className="font-bold text-lg mb-2">Load Analysis:</h3>
            <div className="text-3xl font-bold mb-2">
              {loadPercent.toFixed(1)}%
            </div>
            <div className="text-lg font-semibold mb-1">
              Status: {getStatusMessage(status).text}
            </div>
            <p className="text-sm">
              {getStatusMessage(status).description}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-300 text-sm">
              <p><strong>Measured:</strong> {measured} A</p>
              <p><strong>Rated (RLA):</strong> {rla} A</p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Reference Guide:</h4>
          <ul className="space-y-1">
            <li>• <strong className="text-green-600">0-89%:</strong> Normal operation</li>
            <li>• <strong className="text-yellow-600">90-100%:</strong> High load - monitor closely</li>
            <li>• <strong className="text-red-600">&gt;100%:</strong> Overload condition - check immediately</li>
          </ul>
        </div>

        {loadPercent !== null && status && (
          <SaveToWorkOrder
            calculatorType="Motor Amps Checker"
            category="electrical"
            inputs={{ measuredAmps: measured, ratedLoadAmps: rla }}
            results={{ loadPercent, status, statusMessage: getStatusMessage(status) }}
          />
        )}
      </div>
    </div>
  );
}
