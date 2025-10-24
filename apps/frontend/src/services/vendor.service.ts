import axios from 'axios';
import {
  Vendor,
  CreateVendorDto,
  UpdateVendorDto,
  CreateVendorContactDto,
  CreatePriceAgreementDto,
  CreatePerformanceReviewDto,
  VendorQueryDto,
  VendorListResponse,
  VendorStats,
  VendorContact,
  VendorPriceAgreement,
  VendorPerformanceReview,
} from '../types/view-models/vendor';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

class VendorService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Vendor CRUD
  async createVendor(data: CreateVendorDto): Promise<Vendor> {
    const response = await axios.post<Vendor>(
      `${API_URL}/vendors`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getVendors(query?: VendorQueryDto): Promise<VendorListResponse> {
    const response = await axios.get<VendorListResponse>(
      `${API_URL}/vendors`,
      {
        ...this.getAuthHeaders(),
        params: query,
      }
    );
    return response.data;
  }

  async getVendorById(id: string): Promise<Vendor> {
    const response = await axios.get<Vendor>(
      `${API_URL}/vendors/${id}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updateVendor(id: string, data: UpdateVendorDto): Promise<Vendor> {
    const response = await axios.put<Vendor>(
      `${API_URL}/vendors/${id}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async deleteVendor(id: string): Promise<void> {
    await axios.delete(`${API_URL}/vendors/${id}`, this.getAuthHeaders());
  }

  async getVendorStats(): Promise<VendorStats> {
    const response = await axios.get<VendorStats>(
      `${API_URL}/vendors/stats`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Vendor Contacts
  async createContact(vendorId: string, data: CreateVendorContactDto): Promise<VendorContact> {
    const response = await axios.post<VendorContact>(
      `${API_URL}/vendors/${vendorId}/contacts`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getContacts(vendorId: string): Promise<VendorContact[]> {
    const response = await axios.get<VendorContact[]>(
      `${API_URL}/vendors/${vendorId}/contacts`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updateContact(
    vendorId: string,
    contactId: string,
    data: Partial<CreateVendorContactDto>
  ): Promise<VendorContact> {
    const response = await axios.put<VendorContact>(
      `${API_URL}/vendors/${vendorId}/contacts/${contactId}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async deleteContact(vendorId: string, contactId: string): Promise<void> {
    await axios.delete(
      `${API_URL}/vendors/${vendorId}/contacts/${contactId}`,
      this.getAuthHeaders()
    );
  }

  // Price Agreements
  async createPriceAgreement(
    vendorId: string,
    data: CreatePriceAgreementDto
  ): Promise<VendorPriceAgreement> {
    const response = await axios.post<VendorPriceAgreement>(
      `${API_URL}/vendors/${vendorId}/price-agreements`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getPriceAgreements(
    vendorId: string,
    activeOnly = false
  ): Promise<VendorPriceAgreement[]> {
    const response = await axios.get<VendorPriceAgreement[]>(
      `${API_URL}/vendors/${vendorId}/price-agreements`,
      {
        ...this.getAuthHeaders(),
        params: { activeOnly },
      }
    );
    return response.data;
  }

  async updatePriceAgreement(
    vendorId: string,
    agreementId: string,
    data: Partial<CreatePriceAgreementDto>
  ): Promise<VendorPriceAgreement> {
    const response = await axios.put<VendorPriceAgreement>(
      `${API_URL}/vendors/${vendorId}/price-agreements/${agreementId}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async deactivatePriceAgreement(
    vendorId: string,
    agreementId: string
  ): Promise<VendorPriceAgreement> {
    const response = await axios.delete<VendorPriceAgreement>(
      `${API_URL}/vendors/${vendorId}/price-agreements/${agreementId}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Performance Reviews
  async createPerformanceReview(
    vendorId: string,
    data: CreatePerformanceReviewDto
  ): Promise<VendorPerformanceReview> {
    const response = await axios.post<VendorPerformanceReview>(
      `${API_URL}/vendors/${vendorId}/performance-reviews`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getPerformanceReviews(vendorId: string): Promise<VendorPerformanceReview[]> {
    const response = await axios.get<VendorPerformanceReview[]>(
      `${API_URL}/vendors/${vendorId}/performance-reviews`,
      this.getAuthHeaders()
    );
    return response.data;
  }
}

export default new VendorService();
