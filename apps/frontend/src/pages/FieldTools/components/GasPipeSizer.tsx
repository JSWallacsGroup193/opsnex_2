import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

type PipeType = 'black' | 'csst';

const lookupMinPipeDiameter = (btus: number, length: number, pipeType: PipeType): string => {
  if (pipeType === 'black') {
    // Black Iron Pipe sizing based on NFPA 54 / National Fuel Gas Code
    if (length <= 10) {
      if (btus <= 132000) return '1/2"';
      if (btus <= 278000) return '3/4"';
      if (btus <= 520000) return '1"';
      if (btus <= 1050000) return '1-1/4"';
      return '1-1/2"';
    } else if (length <= 20) {
      if (btus <= 92000) return '1/2"';
      if (btus <= 190000) return '3/4"';
      if (btus <= 350000) return '1"';
      if (btus <= 680000) return '1-1/4"';
      return '1-1/2"';
    } else if (length <= 40) {
      if (btus <= 63000) return '1/2"';
      if (btus <= 130000) return '3/4"';
      if (btus <= 245000) return '1"';
      if (btus <= 480000) return '1-1/4"';
      return '1-1/2"';
    } else if (length <= 60) {
      if (btus <= 50000) return '1/2"';
      if (btus <= 105000) return '3/4"';
      if (btus <= 195000) return '1"';
      if (btus <= 390000) return '1-1/4"';
      return '1-1/2"';
    } else {
      if (btus <= 40000) return '1/2"';
      if (btus <= 85000) return '3/4"';
      if (btus <= 160000) return '1"';
      if (btus <= 320000) return '1-1/4"';
      return '1-1/2"';
    }
  } else {
    // CSST (Corrugated Stainless Steel Tubing) sizing
    if (btus <= 50000) return '3/8"';
    if (btus <= 100000) return '1/2"';
    if (btus <= 200000) return '5/8"';
    if (btus <= 350000) return '3/4"';
    return '1"';
  }
};

export default function GasPipeSizer() {
  const [btus, setBtus] = useState<number | ''>('');
  const [length, setLength] = useState<number | ''>('');
  const [pipeType, setPipeType] = useState<PipeType>('black');
  const [result, setResult] = useState<{
    size: string;
    pipeType: string;
  } | null>(null);

  const calculate = () => {
    if (btus === '' || length === '') {
      alert('Enter all fields');
      return;
    }

    const size = lookupMinPipeDiameter(Number(btus), Number(length), pipeType);
    setResult({
      size,
      pipeType: pipeType === 'black' ? 'Black Iron Pipe' : 'CSST (Flexible Gas Line)',
    });
  };

  const reset = () => {
    setBtus('');
    setLength('');
    setPipeType('black');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gas Pipe Sizer</h2>
        <p className="text-gray-600">Calculate minimum gas pipe size based on BTU load and length</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total BTU Load
          </label>
          <input
            type="number"
            placeholder="Enter total BTUs"
            value={btus}
            onChange={(e) => setBtus(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Sum of all appliances on this gas line</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pipe Length (feet)
          </label>
          <input
            type="number"
            placeholder="Enter pipe length"
            value={length}
            onChange={(e) => setLength(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Measure from meter to furthest appliance</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pipe Material
          </label>
          <select
            value={pipeType}
            onChange={(e) => setPipeType(e.target.value as PipeType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="black">Black Iron Pipe (Schedule 40)</option>
            <option value="csst">CSST (Corrugated Stainless Steel)</option>
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
          <div className="p-4 rounded-md bg-green-50 border border-green-300">
            <h3 className="font-bold text-lg mb-3">Recommended Pipe Size:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Minimum Pipe Size:</span>
                <span className="text-2xl font-bold text-green-700">
                  {result.size}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Pipe Type:</span>
                <span className="text-lg">{result.pipeType}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-sm text-green-800">
                ⚠️ This is the <strong>minimum</strong> size. Always verify with local codes and manufacturer specs.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Gas Pipe Sizing Guidelines:</h4>
          <ul className="space-y-1">
            <li>• Based on NFPA 54 / National Fuel Gas Code</li>
            <li>• Assumes 0.5 psi inlet pressure (residential)</li>
            <li>• Add BTUs of ALL appliances on the line</li>
            <li>• Measure length to furthest appliance</li>
            <li>• Black iron is most common for residential</li>
            <li>• CSST offers flexible installation options</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm">
          <p className="font-semibold text-yellow-800 mb-1">⚠️ Important Safety Notice:</p>
          <p className="text-yellow-700">
            Gas pipe installation must comply with local codes. Always have gas work performed by a licensed professional. This calculator provides estimates only.
          </p>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Gas Pipe Sizer"
            category="gas"
            inputs={{ btuLoad: btus, pipeLength: length, pipeType }}
            results={{ recommendedSize: result.size, pipeTypeName: result.pipeType }}
          />
        )}
      </div>
    </div>
  );
}
