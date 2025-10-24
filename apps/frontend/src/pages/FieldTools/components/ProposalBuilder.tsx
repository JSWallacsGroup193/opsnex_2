import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface Proposal {
  id: string;
  proposalNumber: string;
  estimateId: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'expired';
  validUntil?: string;
  terms?: string;
  customerNotes?: string;
  internalNotes?: string;
  totalAmount: number;
  taxAmount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  lineItems: ProposalLineItem[];
  estimate?: {
    workOrder?: {
      id: string;
      workOrderNumber: string;
      account?: {
        name: string;
        billingAddress?: string;
        billingCity?: string;
        billingState?: string;
        billingZip?: string;
      };
    };
  };
}

interface ProposalLineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

export default function ProposalBuilder() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    terms: '',
    customerNotes: '',
    validUntil: '',
  });

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const data = await api.get('/estimator/proposals');
      setProposals(data);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setFormData({
      title: proposal.title,
      terms: proposal.terms || '',
      customerNotes: proposal.customerNotes || '',
      validUntil: proposal.validUntil ? format(new Date(proposal.validUntil), 'yyyy-MM-dd') : '',
    });
    setEditMode(false);
  };

  const handleUpdateProposal = async () => {
    if (!selectedProposal) return;

    try {
      setLoading(true);
      await api.put(`/estimator/proposals/${selectedProposal.id}`, {
        title: formData.title,
        terms: formData.terms,
        customerNotes: formData.customerNotes,
        validUntil: formData.validUntil || undefined,
      });
      await loadProposals();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating proposal:', error);
      alert('Failed to update proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: Proposal['status']) => {
    if (!selectedProposal) return;

    try {
      setLoading(true);
      await api.put(`/estimator/proposals/${selectedProposal.id}`, { status });
      await loadProposals();
      const updated = proposals.find(p => p.id === selectedProposal.id);
      if (updated) {
        setSelectedProposal({ ...selectedProposal, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!selectedProposal) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(20, 184, 166);
    doc.text('PROPOSAL', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Proposal #${selectedProposal.proposalNumber}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    const account = selectedProposal.estimate?.workOrder?.account;
    if (account) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('CUSTOMER', margin, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(account.name, margin, yPosition);
      yPosition += 5;
      
      if (account.billingAddress) {
        doc.text(account.billingAddress, margin, yPosition);
        yPosition += 5;
      }
      
      if (account.billingCity && account.billingState && account.billingZip) {
        doc.text(`${account.billingCity}, ${account.billingState} ${account.billingZip}`, margin, yPosition);
        yPosition += 5;
      }
      yPosition += 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PROJECT DETAILS', margin, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Title: ${selectedProposal.title}`, margin, yPosition);
    yPosition += 5;
    
    if (selectedProposal.description) {
      doc.text(`Description: ${selectedProposal.description}`, margin, yPosition);
      yPosition += 5;
    }

    if (selectedProposal.validUntil) {
      doc.text(`Valid Until: ${format(new Date(selectedProposal.validUntil), 'MMM dd, yyyy')}`, margin, yPosition);
      yPosition += 5;
    }
    yPosition += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('LINE ITEMS', margin, yPosition);
    yPosition += 7;

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Category', margin + 2, yPosition);
    doc.text('Description', margin + 35, yPosition);
    doc.text('Qty', margin + 100, yPosition);
    doc.text('Unit Price', margin + 120, yPosition);
    doc.text('Total', margin + 160, yPosition, { align: 'right' });
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    selectedProposal.lineItems.forEach((item) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(item.category, margin + 2, yPosition);
      const descLines = doc.splitTextToSize(item.description, 60);
      doc.text(descLines[0], margin + 35, yPosition);
      doc.text(item.quantity.toString(), margin + 100, yPosition);
      doc.text(`$${Number(item.unitPrice).toFixed(2)}`, margin + 120, yPosition);
      doc.text(`$${Number(item.total).toFixed(2)}`, margin + 160, yPosition, { align: 'right' });
      yPosition += 7;
    });

    yPosition += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Subtotal:', margin + 120, yPosition);
    doc.text(`$${Number(selectedProposal.subtotal).toFixed(2)}`, margin + 160, yPosition, { align: 'right' });
    yPosition += 6;

    if (selectedProposal.taxAmount > 0) {
      doc.text('Tax:', margin + 120, yPosition);
      doc.text(`$${Number(selectedProposal.taxAmount).toFixed(2)}`, margin + 160, yPosition, { align: 'right' });
      yPosition += 6;
    }

    doc.setFontSize(12);
    doc.setTextColor(20, 184, 166);
    doc.text('Total:', margin + 120, yPosition);
    doc.text(`$${Number(selectedProposal.totalAmount).toFixed(2)}`, margin + 160, yPosition, { align: 'right' });
    yPosition += 15;

    if (selectedProposal.terms) {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('TERMS & CONDITIONS', margin, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const termsLines = doc.splitTextToSize(selectedProposal.terms, pageWidth - 2 * margin);
      doc.text(termsLines, margin, yPosition);
      yPosition += termsLines.length * 5;
    }

    if (selectedProposal.customerNotes) {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('NOTES', margin, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const notesLines = doc.splitTextToSize(selectedProposal.customerNotes, pageWidth - 2 * margin);
      doc.text(notesLines, margin, yPosition);
    }

    doc.save(`Proposal_${selectedProposal.proposalNumber}.pdf`);
  };

  const getStatusBadgeClass = (status: Proposal['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-300';
      case 'sent': return 'bg-blue-500/20 text-blue-300';
      case 'viewed': return 'bg-purple-500/20 text-purple-300';
      case 'approved': return 'bg-green-500/20 text-green-300';
      case 'rejected': return 'bg-red-500/20 text-red-300';
      case 'expired': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Proposal Builder</h2>
          <p className="text-sm text-gray-400 mt-1">Create and manage customer proposals</p>
        </div>
        <button
          onClick={() => navigate('/field-tools')}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Field Tools
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Proposals</h3>
            
            {loading && proposals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No proposals yet</p>
                <p className="text-sm mt-2">Create estimates first, then convert them to proposals</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {proposals.map((proposal) => (
                  <button
                    key={proposal.id}
                    onClick={() => handleSelectProposal(proposal)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProposal?.id === proposal.id
                        ? 'bg-teal-500/20 border border-teal-500'
                        : 'bg-slate-700 hover:bg-slate-600 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{proposal.title}</p>
                        <p className="text-xs text-gray-400 mt-1">#{proposal.proposalNumber}</p>
                      </div>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-400">{format(new Date(proposal.createdAt), 'MMM dd, yyyy')}</span>
                      <span className="font-semibold text-teal-400">${Number(proposal.totalAmount).toFixed(2)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedProposal ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">Select a proposal to view details</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedProposal.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">Proposal #{selectedProposal.proposalNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!editMode ? (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-3 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleUpdateProposal}
                        disabled={loading}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            title: selectedProposal.title,
                            terms: selectedProposal.terms || '',
                            customerNotes: selectedProposal.customerNotes || '',
                            validUntil: selectedProposal.validUntil ? format(new Date(selectedProposal.validUntil), 'yyyy-MM-dd') : '',
                          });
                        }}
                        className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Valid Until</label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Terms & Conditions</label>
                    <textarea
                      value={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter terms and conditions..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Customer Notes</label>
                    <textarea
                      value={formData.customerNotes}
                      onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter customer-facing notes..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeClass(selectedProposal.status)}`}>
                          {selectedProposal.status}
                        </span>
                        <select
                          value={selectedProposal.status}
                          onChange={(e) => handleUpdateStatus(e.target.value as Proposal['status'])}
                          className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="viewed">Viewed</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white mt-1">{format(new Date(selectedProposal.createdAt), 'MMM dd, yyyy hh:mm a')}</p>
                    </div>
                    {selectedProposal.validUntil && (
                      <div>
                        <p className="text-sm text-gray-400">Valid Until</p>
                        <p className="text-white mt-1">{format(new Date(selectedProposal.validUntil), 'MMM dd, yyyy')}</p>
                      </div>
                    )}
                  </div>

                  {selectedProposal.description && (
                    <div>
                      <p className="text-sm text-gray-400">Description</p>
                      <p className="text-white mt-1">{selectedProposal.description}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Line Items</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Category</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Description</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Qty</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Unit Price</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {selectedProposal.lineItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-sm text-white">{item.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-300">{item.description}</td>
                              <td className="px-4 py-3 text-sm text-white text-right">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-white text-right">${Number(item.unitPrice).toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm font-medium text-white text-right">${Number(item.total).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="space-y-2 max-w-md ml-auto">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal:</span>
                        <span>${Number(selectedProposal.subtotal).toFixed(2)}</span>
                      </div>
                      {selectedProposal.taxAmount > 0 && (
                        <div className="flex justify-between text-gray-300">
                          <span>Tax:</span>
                          <span>${Number(selectedProposal.taxAmount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-bold text-teal-400 border-t border-slate-700 pt-2">
                        <span>Total:</span>
                        <span>${Number(selectedProposal.totalAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedProposal.terms && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Terms & Conditions</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedProposal.terms}</p>
                    </div>
                  )}

                  {selectedProposal.customerNotes && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Notes</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedProposal.customerNotes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
