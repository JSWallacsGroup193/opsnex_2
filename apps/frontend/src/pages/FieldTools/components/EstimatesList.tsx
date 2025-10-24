import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { format } from 'date-fns';
import ConvertToProposal from './ConvertToProposal';

interface Estimate {
  id: string;
  estimateType: 'ai' | 'manual';
  estimateMode?: string;
  title: string;
  description?: string;
  projectType?: string;
  finalPrice: number;
  status?: string;
  createdAt: string;
  workOrder?: {
    workOrderNumber: string;
  };
}

export default function EstimatesList() {
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ai' | 'manual'>('all');

  useEffect(() => {
    loadEstimates();
  }, [filter]);

  const loadEstimates = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?type=${filter}` : '';
      const data = await api.get(`/estimator/estimates${params}`);
      setEstimates(data);
    } catch (error) {
      console.error('Error loading estimates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadgeClass = (type: string) => {
    return type === 'ai' 
      ? 'bg-blue-500/20 text-blue-300' 
      : 'bg-green-500/20 text-green-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Estimates</h2>
          <p className="text-sm text-gray-400 mt-1">View and manage all cost estimates</p>
        </div>
        <button
          onClick={() => navigate('/field-tools')}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Field Tools
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'ai'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            AI Estimates
          </button>
          <button
            onClick={() => setFilter('manual')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'manual'
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Manual Estimates
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading estimates...</p>
          </div>
        ) : estimates.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">No estimates found</p>
            <p className="text-sm mt-2">Create an estimate using the AI or Manual Cost Estimator</p>
          </div>
        ) : (
          <div className="space-y-4">
            {estimates.map((estimate) => (
              <div key={estimate.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeClass(estimate.estimateType)}`}>
                        {estimate.estimateType.toUpperCase()}
                      </span>
                      {estimate.estimateMode && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-300">
                          {estimate.estimateMode}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white truncate">{estimate.title}</h3>
                    
                    {estimate.description && (
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">{estimate.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <span>Created: {format(new Date(estimate.createdAt), 'MMM dd, yyyy')}</span>
                      {estimate.workOrder && (
                        <span>WO: {estimate.workOrder.workOrderNumber}</span>
                      )}
                      {estimate.projectType && (
                        <span>Type: {estimate.projectType}</span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <p className="text-2xl font-bold text-teal-400">${Number(estimate.finalPrice).toFixed(2)}</p>
                    <div className="mt-3">
                      <ConvertToProposal estimateId={estimate.id} onSuccess={loadEstimates} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
