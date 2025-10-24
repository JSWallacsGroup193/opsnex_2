import { useState } from 'react';
import { SaveToWorkOrder } from './SaveToWorkOrder';

type FloorType = 'concrete' | 'wood' | 'tile';

export default function RadiantHeatingCalculator() {
  const [roomArea, setRoomArea] = useState<number | ''>('');
  const [heatLoss, setHeatLoss] = useState<number | ''>('');
  const [floorType, setFloorType] = useState<FloorType>('concrete');
  const [waterTemp, setWaterTemp] = useState<number | ''>('');
  const [result, setResult] = useState<{
    tubeLength: number;
    tubeSpacing: number;
    flowRate: number;
    surfaceTemp: number;
    outputPerSqFt: number;
  } | null>(null);

  const calculate = () => {
    if (roomArea === '' || heatLoss === '' || waterTemp === '') {
      alert('Enter all fields');
      return;
    }

    const area = Number(roomArea);
    const loss = Number(heatLoss);
    const temp = Number(waterTemp);

    // Calculate output per square foot needed
    const outputPerSqFt = loss / area;

    // Determine tubing spacing based on output needs
    let tubeSpacing = 12; // Default 12" spacing
    if (outputPerSqFt > 30) {
      tubeSpacing = 6; // High output - 6" spacing
    } else if (outputPerSqFt > 20) {
      tubeSpacing = 9; // Medium output - 9" spacing
    }

    // Calculate tube length (in feet)
    const tubeLength = (area * 12) / tubeSpacing;

    // Estimate surface temperature based on water temp and floor type
    let tempDrop = 15; // Default for concrete
    if (floorType === 'wood') {
      tempDrop = 20; // Wood has more resistance
    } else if (floorType === 'tile') {
      tempDrop = 10; // Tile conducts better
    }
    const surfaceTemp = temp - tempDrop;

    // Calculate flow rate (GPM)
    const deltaT = 10; // Typical ΔT for radiant floor
    const flowRate = loss / (500 * deltaT);

    setResult({
      tubeLength: Math.ceil(tubeLength),
      tubeSpacing,
      flowRate,
      surfaceTemp,
      outputPerSqFt,
    });
  };

  const reset = () => {
    setRoomArea('');
    setHeatLoss('');
    setFloorType('concrete');
    setWaterTemp('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Radiant Floor Heating Calculator</h2>
        <p className="text-gray-600">Calculate tubing layout and flow requirements for radiant floor systems</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Area (square feet)
          </label>
          <input
            type="number"
            placeholder="Enter room area"
            value={roomArea}
            onChange={(e) => setRoomArea(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Heat Loss (BTU/hr)
          </label>
          <input
            type="number"
            placeholder="Enter heat loss"
            value={heatLoss}
            onChange={(e) => setHeatLoss(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">From Manual J or heat loss calculation</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Floor Type
          </label>
          <select
            value={floorType}
            onChange={(e) => setFloorType(e.target.value as FloorType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="concrete">Concrete Slab</option>
            <option value="wood">Wood Frame/Subfloor</option>
            <option value="tile">Tile over Concrete</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supply Water Temperature (°F)
          </label>
          <input
            type="number"
            placeholder="Enter water temp"
            value={waterTemp}
            onChange={(e) => setWaterTemp(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Typically 90-120°F for radiant floors</p>
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

        {result && (
          <div className="p-4 rounded-md bg-green-50 border border-green-300">
            <h3 className="font-bold text-lg mb-3">Radiant System Design:</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Tube Spacing:</span>
                <span className="text-xl font-bold text-green-700">
                  {result.tubeSpacing} inches on center
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Total Tube Length:</span>
                <span className="text-lg font-bold">{result.tubeLength} feet</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Required Flow Rate:</span>
                <span className="text-lg">{result.flowRate.toFixed(2)} GPM</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Surface Temp:</span>
                <span className="text-lg">{result.surfaceTemp.toFixed(0)}°F</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Output per sq ft:</span>
                <span className="text-lg">{result.outputPerSqFt.toFixed(1)} BTU/hr/ft²</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-sm text-green-800">
                💡 Use {result.tubeSpacing === 6 ? '3/8"' : '1/2"'} PEX tubing for this application
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Radiant Floor Guidelines:</h4>
          <ul className="space-y-1">
            <li>• Tube spacing: 6" (high output), 9" (medium), 12" (standard)</li>
            <li>• Maximum loop length: 300 feet per circuit</li>
            <li>• Typical supply temp: 90-120°F (lower for wood floors)</li>
            <li>• Maximum surface temp: 85°F (comfort limit)</li>
            <li>• Output range: 15-35 BTU/hr/ft² depending on spacing</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm">
          <h4 className="font-semibold text-yellow-800 mb-2">Floor Type Considerations:</h4>
          <ul className="space-y-1 text-yellow-700">
            <li>• <strong>Concrete:</strong> Best heat transfer, highest output, most thermal mass</li>
            <li>• <strong>Wood:</strong> Lower conductivity, limit supply temp to 100-110°F</li>
            <li>• <strong>Tile:</strong> Excellent conductivity, comfortable underfoot, holds heat well</li>
            <li>• <strong>Carpet:</strong> Reduces output by 20-30%, use closer tube spacing</li>
          </ul>
        </div>

        {result && (
          <SaveToWorkOrder
            calculatorType="Radiant Floor Heating Calculator"
            category="hydronic"
            inputs={{ roomArea, heatLoss, floorType, waterTemp }}
            results={{ tubeLength: result.tubeLength, tubeSpacing: result.tubeSpacing, flowRate: result.flowRate, surfaceTemp: result.surfaceTemp, outputPerSqFt: result.outputPerSqFt }}
          />
        )}
      </div>
    </div>
  );
}
