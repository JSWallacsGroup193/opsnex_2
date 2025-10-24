import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';

interface SaveToWorkOrderProps {
  calculatorType: string;
  category: string;
  inputs: any;
  results: any;
  onSaved?: () => void;
}

export const SaveToWorkOrder: React.FC<SaveToWorkOrderProps> = memo(({
  calculatorType,
  category,
  inputs,
  results,
  onSaved,
}) => {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (showDialog) {
      fetchWorkOrders();
    }
  }, [showDialog]);

  const fetchWorkOrders = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId') || 'demo-tenant';
      const response = await axios.get(`/api/v1/work-orders/${tenantId}`);
      setWorkOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      setMessage({ type: 'error', text: 'Failed to load work orders' });
    }
  };

  const handleSave = async () => {
    if (!selectedWorkOrderId) {
      setMessage({ type: 'error', text: 'Please select a work order' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await axios.post('/api/v1/field-calculations', {
        calculatorType,
        category,
        inputs,
        results,
        workOrderId: selectedWorkOrderId,
        notes: notes.trim() || undefined,
      });

      setMessage({ type: 'success', text: 'Calculation saved successfully!' });
      setNotes('');
      setSelectedWorkOrderId('');
      
      setTimeout(() => {
        setShowDialog(false);
        setMessage(null);
        onSaved?.();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving calculation:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save calculation';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setMessage(null);
    setNotes('');
    setSelectedWorkOrderId('');
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
      >
        💾 Save to Work Order
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Save Calculation to Work Order
            </h2>

            {message && (
              <div
                className={`mb-4 p-3 rounded ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Work Order *
                </label>
                <select
                  value={selectedWorkOrderId}
                  onChange={(e) => setSelectedWorkOrderId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={saving}
                >
                  <option value="">-- Select a work order --</option>
                  {workOrders.map((wo) => (
                    <option key={wo.id} value={wo.id}>
                      {wo.number} - {wo.title || 'Untitled'}
                      {wo.status && ` (${wo.status})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes about this calculation..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  disabled={saving}
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Calculator:</strong> {calculatorType}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {category}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !selectedWorkOrderId}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
