import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
} from 'lucide-react';
import vendorService from '../services/vendor.service';
import { Vendor } from '../types/view-models/vendor';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'contacts' | 'pricing' | 'reviews';

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (id) loadVendor();
  }, [id]);

  async function loadVendor() {
    if (!id) return;
    try {
      setLoading(true);
      const data = await vendorService.getVendorById(id);
      setVendor(data);
    } catch (error) {
      toast.error('Failed to load vendor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!id || !vendor) return;
    if (!confirm(`Are you sure you want to delete ${vendor.companyName}?`)) return;

    try {
      await vendorService.deleteVendor(id);
      toast.success('Vendor deleted successfully');
      navigate('/vendors');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete vendor');
    }
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-slate-400 text-sm">No rating</span>;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
        <span className="text-sm text-slate-400 ml-2">({rating}/5)</span>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'text-green-400 bg-green-500/20 border-green-500/30',
      INACTIVE: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
      SUSPENDED: 'text-red-400 bg-red-500/20 border-red-500/30',
      PENDING: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    };
    return colors[status] || colors.ACTIVE;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Vendor not found</p>
          <button
            onClick={() => navigate('/vendors')}
            className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 md:px-6 py-4 md:py-6">
        <button
          onClick={() => navigate('/vendors')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Vendors</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <Building2 className="w-8 h-8 text-teal-500 flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {vendor.companyName}
                </h1>
                {vendor.displayName && vendor.displayName !== vendor.companyName && (
                  <p className="text-slate-400">{vendor.displayName}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-sm text-teal-400">{vendor.vendorCode}</span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(vendor.status)}`}>
                    {vendor.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {vendor.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${vendor.email}`} className="text-teal-400 hover:underline">
                    {vendor.email}
                  </a>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${vendor.phone}`} className="text-slate-300">
                    {vendor.phone}
                  </a>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
              {(vendor.city || vendor.state) && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>
                    {vendor.city}
                    {vendor.state && `, ${vendor.state}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/vendors/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border-none min-h-[44px]"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors border-none min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-3 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Overall Rating</p>
                {renderStars(vendor.rating ?? null)}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Contacts</p>
                <p className="text-xl font-bold text-white">
                  {vendor.contacts?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Price Agreements</p>
                <p className="text-xl font-bold text-white">
                  {vendor._count?.priceAgreements || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Reviews</p>
                <p className="text-xl font-bold text-white">
                  {vendor._count?.performanceReviews || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-slate-700 overflow-x-auto">
            {(['overview', 'contacts', 'pricing', 'reviews'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-none min-w-[120px] ${
                  activeTab === tab
                    ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Vendor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Type:</span>
                      <p className="text-white mt-1">{vendor.type.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Payment Terms:</span>
                      <p className="text-white mt-1">{vendor.paymentTerms || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Tax ID:</span>
                      <p className="text-white mt-1">{vendor.taxId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Credit Limit:</span>
                      <p className="text-white mt-1">
                        {vendor.creditLimit ? `$${vendor.creditLimit.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {vendor.address && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Address</h3>
                    <div className="text-sm text-slate-300">
                      <p>{vendor.address}</p>
                      <p>
                        {vendor.city}
                        {vendor.state && `, ${vendor.state}`} {vendor.postalCode}
                      </p>
                      {vendor.country && <p>{vendor.country}</p>}
                    </div>
                  </div>
                )}

                {vendor.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{vendor.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contacts</h3>
                {vendor.contacts && vendor.contacts.length > 0 ? (
                  <div className="space-y-3">
                    {vendor.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-white">
                              {contact.firstName} {contact.lastName}
                            </p>
                            {contact.title && (
                              <p className="text-sm text-slate-400">{contact.title}</p>
                            )}
                          </div>
                          {contact.isPrimary && (
                            <span className="px-2 py-1 text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-slate-300">
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-teal-400 hover:underline"
                              >
                                {contact.email}
                              </a>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No contacts added yet</p>
                )}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Price Agreements</h3>
                {vendor.priceAgreements && vendor.priceAgreements.length > 0 ? (
                  <div className="space-y-3">
                    {vendor.priceAgreements.map((agreement) => (
                      <div
                        key={agreement.id}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-white">
                              {agreement.sku?.description || agreement.skuId}
                            </p>
                            {agreement.sku?.skuCode && (
                              <p className="text-sm text-slate-400 font-mono">
                                {agreement.sku.skuCode}
                              </p>
                            )}
                          </div>
                          <p className="text-xl font-bold text-green-400">
                            ${Number(agreement.unitPrice).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>
                            Effective: {new Date(agreement.effectiveDate).toLocaleDateString()}
                          </span>
                          {agreement.expirationDate && (
                            <span>
                              Expires: {new Date(agreement.expirationDate).toLocaleDateString()}
                            </span>
                          )}
                          {!agreement.isActive && (
                            <span className="text-red-400">Inactive</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No price agreements yet</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Performance Reviews</h3>
                {vendor.performanceReviews && vendor.performanceReviews.length > 0 ? (
                  <div className="space-y-4">
                    {vendor.performanceReviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm text-slate-400">
                              {new Date(review.reviewDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              Period: {new Date(review.reviewPeriodStart).toLocaleDateString()} -{' '}
                              {new Date(review.reviewPeriodEnd).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(Math.round(Number(review.overallRating)))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-slate-400">Quality</p>
                            <p className="text-sm text-white">{review.qualityRating}/5</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Delivery</p>
                            <p className="text-sm text-white">{review.deliveryRating}/5</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Service</p>
                            <p className="text-sm text-white">{review.serviceRating}/5</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Pricing</p>
                            <p className="text-sm text-white">{review.pricingRating}/5</p>
                          </div>
                        </div>

                        {review.comments && (
                          <p className="text-sm text-slate-300 mt-2">{review.comments}</p>
                        )}

                        {review.reviewedBy && (
                          <p className="text-xs text-slate-500 mt-2">
                            Reviewed by:{' '}
                            {review.reviewedBy.firstName && review.reviewedBy.lastName
                              ? `${review.reviewedBy.firstName} ${review.reviewedBy.lastName}`
                              : review.reviewedBy.email}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No reviews yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
