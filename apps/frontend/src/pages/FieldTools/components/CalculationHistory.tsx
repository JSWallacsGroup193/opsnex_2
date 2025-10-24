import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CalculationHistoryProps {
  workOrderId?: string;
  technicianId?: string;
  showAll?: boolean;
}

interface FieldCalculation {
  id: string;
  calculatorType: string;
  category: string;
  inputs: any;
  results: any;
  notes?: string;
  createdAt: string;
  technician: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  workOrder?: {
    id: string;
    number: string;
    title: string;
  };
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  workOrderId,
  technicianId,
  showAll = false,
}) => {
  const [calculations, setCalculations] = useState<FieldCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCalculations();
  }, [workOrderId, technicianId, showAll]);

  const fetchCalculations = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = '/api/v1/field-calculations';
      const params = new URLSearchParams();
      
      if (workOrderId) {
        params.append('workOrderId', workOrderId);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      } else if (technicianId) {
        url = `/api/v1/field-calculations/technician/${technicianId}`;
      }

      const response = await axios.get(url);
      setCalculations(response.data || []);
    } catch (err: any) {
      console.error('Error fetching calculations:', err);
      setError(err.response?.data?.message || 'Failed to load calculation history');
    } finally {
      setLoading(false);
    }
  };

  const deleteCalculation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this calculation?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/field-calculations/${id}`);
      setCalculations(calculations.filter(calc => calc.id !== id));
    } catch (err: any) {
      console.error('Error deleting calculation:', err);
      alert(err.response?.data?.message || 'Failed to delete calculation');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electrical: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      refrigeration: 'bg-blue-100 text-blue-800 border-blue-300',
      airflow: 'bg-green-100 text-green-800 border-green-300',
      gas: 'bg-red-100 text-red-800 border-red-300',
      hydronic: 'bg-purple-100 text-purple-800 border-purple-300',
      utility: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTechnicianName = (technician: FieldCalculation['technician']) => {
    if (technician.firstName && technician.lastName) {
      return `${technician.firstName} ${technician.lastName}`;
    }
    return technician.email;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading calculation history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">⚠️ {error}</p>
        <button
          onClick={fetchCalculations}
          className="mt-2 text-red-600 underline hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No calculations saved yet.</p>
        <p className="text-sm text-gray-500 mt-1">
          Calculations will appear here once technicians save them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Calculation History
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({calculations.length} {calculations.length === 1 ? 'calculation' : 'calculations'})
          </span>
        </h2>
        <button
          onClick={fetchCalculations}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-3">
        {calculations.map((calc) => (
          <div
            key={calc.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(calc.category)}`}>
                      {calc.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800">{calc.calculatorType}</h3>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Technician:</span> {getTechnicianName(calc.technician)}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(calc.createdAt)}
                    </div>
                    {calc.workOrder && (
                      <div>
                        <span className="font-medium">Work Order:</span> {calc.workOrder.number} - {calc.workOrder.title}
                      </div>
                    )}
                    {calc.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                        <span className="font-medium">Notes:</span> {calc.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === calc.id ? null : calc.id)}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                  >
                    {expandedId === calc.id ? 'Hide Details' : 'Show Details'}
                  </button>
                  <button
                    onClick={() => deleteCalculation(calc.id)}
                    className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedId === calc.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Inputs:</h4>
                      <pre className="bg-gray-50 p-3 rounded border border-gray-200 text-xs overflow-x-auto">
                        {JSON.stringify(calc.inputs, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Results:</h4>
                      <pre className="bg-gray-50 p-3 rounded border border-gray-200 text-xs overflow-x-auto">
                        {JSON.stringify(calc.results, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
