import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import vendorService from '../services/vendor.service';
import { Vendor, VendorQueryDto, VendorStatus, VendorType } from '../types/view-models/vendor';
import toast from 'react-hot-toast';

export default function Vendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<VendorType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVendors();
  }, [search, statusFilter, typeFilter, currentPage]);

  async function loadVendors() {
    try {
      setLoading(true);
      const query: VendorQueryDto = {
        page: currentPage,
        limit: 20,
      };

      if (search) query.search = search;
      if (statusFilter) query.status = statusFilter;
      if (typeFilter) query.type = typeFilter;

      const response = await vendorService.getVendors(query);
      setVendors(response.vendors);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load vendors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: VendorStatus) => {
    const statusColors = {
      ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
      INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      SUSPENDED: 'bg-red-500/20 text-red-400 border-red-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: VendorType) => {
    const typeColors: Record<VendorType, string> = {
      EQUIPMENT_SUPPLIER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      PARTS_DISTRIBUTOR: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      SERVICE_PROVIDER: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      MANUFACTURER: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      CONTRACTOR: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      CONSULTANT: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      OTHER: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${typeColors[type]}`}>
        {type.replace(/_/g, ' ')}
      </span>
    );
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 md:px-6 py-4 md:py-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Vendor Management</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage suppliers, track performance, and maintain relationships
            </p>
          </div>
          <button
            onClick={() => navigate('/vendors/new')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors border-none min-h-[48px] md:min-h-[44px] md:px-4 md:py-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Vendor</span>
          </button>
        </div>
      </div>

      <div className="p-3 md:p-6 pt-0">
        {/* Search and Filters */}
        <div className="mb-6 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendors by name, code, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white w-full justify-center min-h-[48px]"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>

          {/* Filters */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:flex md:gap-3 space-y-3 md:space-y-0`}
          >
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as VendorStatus | '');
                setCurrentPage(1);
              }}
              className="w-full md:w-auto px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors min-h-[48px] md:min-h-[44px]"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING">Pending</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as VendorType | '');
                setCurrentPage(1);
              }}
              className="w-full md:w-auto px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors min-h-[48px] md:min-h-[44px]"
            >
              <option value="">All Types</option>
              <option value="EQUIPMENT_SUPPLIER">Equipment Supplier</option>
              <option value="PARTS_DISTRIBUTOR">Parts Distributor</option>
              <option value="SERVICE_PROVIDER">Service Provider</option>
              <option value="MANUFACTURER">Manufacturer</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="CONSULTANT">Consultant</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-slate-800 rounded-lg overflow-x-auto border border-slate-700">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-700 text-left">
                    <th className="p-3 border-b border-slate-600 text-gray-300">Vendor</th>
                    <th className="p-3 border-b border-slate-600 text-gray-300">Code</th>
                    <th className="p-3 border-b border-slate-600 text-gray-300">Type</th>
                    <th className="p-3 border-b border-slate-600 text-gray-300">Status</th>
                    <th className="p-3 border-b border-slate-600 text-gray-300">Rating</th>
                    <th className="p-3 border-b border-slate-600 text-gray-300">Contact</th>
                    <th className="p-3 border-b border-slate-600 text-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">
                        No vendors found
                      </td>
                    </tr>
                  ) : (
                    vendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="hover:bg-slate-700/50 cursor-pointer"
                        onClick={() => navigate(`/vendors/${vendor.id}`)}
                      >
                        <td className="p-3 border-b border-slate-700">
                          <div>
                            <div className="font-medium text-white">
                              {vendor.companyName}
                            </div>
                            {vendor.displayName && vendor.displayName !== vendor.companyName && (
                              <div className="text-sm text-slate-400">{vendor.displayName}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 border-b border-slate-700">
                          <span className="font-mono text-sm text-teal-400">
                            {vendor.vendorCode}
                          </span>
                        </td>
                        <td className="p-3 border-b border-slate-700">
                          {getTypeBadge(vendor.type)}
                        </td>
                        <td className="p-3 border-b border-slate-700">
                          {getStatusBadge(vendor.status)}
                        </td>
                        <td className="p-3 border-b border-slate-700">
                          {renderStars(vendor.rating ?? null)}
                        </td>
                        <td className="p-3 border-b border-slate-700">
                          <div className="text-sm space-y-1">
                            {vendor.email && (
                              <div className="flex items-center gap-1 text-slate-400">
                                <Mail className="w-3 h-3" />
                                <span>{vendor.email}</span>
                              </div>
                            )}
                            {vendor.phone && (
                              <div className="flex items-center gap-1 text-slate-400">
                                <Phone className="w-3 h-3" />
                                <span>{vendor.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 border-b border-slate-700">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {vendors.length === 0 ? (
                <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
                  <Building2 className="w-12 h-12 text-teal-500 mx-auto mb-3" />
                  <p className="text-slate-400">No vendors found</p>
                </div>
              ) : (
                vendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3 active:bg-slate-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-teal-500" />
                          <span className="font-medium text-white">{vendor.companyName}</span>
                        </div>
                        <span className="font-mono text-xs text-teal-400">
                          {vendor.vendorCode}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {getTypeBadge(vendor.type)}
                      {getStatusBadge(vendor.status)}
                    </div>

                    {vendor.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Rating:</span>
                        {renderStars(vendor.rating)}
                      </div>
                    )}

                    {(vendor.email || vendor.phone || vendor.city) && (
                      <div className="space-y-1 text-sm text-slate-400">
                        {vendor.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{vendor.email}</span>
                          </div>
                        )}
                        {vendor.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>{vendor.phone}</span>
                          </div>
                        )}
                        {vendor.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {vendor.city}
                              {vendor.state && `, ${vendor.state}`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors min-h-[44px]"
                >
                  Previous
                </button>
                <span className="text-white px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors min-h-[44px]"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
