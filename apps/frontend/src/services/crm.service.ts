/**
 * CRM Service
 * Handles customer accounts, contacts, leads, and notes
 */

import apiClient from './api';
import type { 
  Account, 
  Contact, 
  Lead, 
  CustomerNote,
} from '../types';

export const crmService = {
  // ============================================================================
  // Account Operations
  // ============================================================================

  /**
   * Get all accounts for tenant
   */
  async getAccounts(tenantId: string): Promise<Account[]> {
    return apiClient.get<Account[]>(`/crm/accounts/${tenantId}`);
  },

  /**
   * Get single account by ID
   */
  async getAccount(id: string): Promise<Account> {
    return apiClient.get<Account>(`/crm/accounts/${id}`);
  },

  /**
   * Create new account
   */
  async createAccount(data: { name: string; type: 'RESIDENTIAL' | 'COMMERCIAL' }): Promise<Account> {
    return apiClient.post<Account>('/crm/accounts', data);
  },

  /**
   * Update account
   */
  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    return apiClient.put<Account>(`/crm/accounts/${id}`, data);
  },

  // ============================================================================
  // Contact Operations
  // ============================================================================

  /**
   * Get all contacts for tenant
   */
  async getContacts(tenantId: string): Promise<Contact[]> {
    return apiClient.get<Contact[]>(`/crm/contacts/${tenantId}`);
  },

  /**
   * Get single contact by ID
   */
  async getContact(id: string): Promise<Contact> {
    return apiClient.get<Contact>(`/crm/contacts/${id}`);
  },

  /**
   * Create new contact
   */
  async createContact(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    accountId?: string;
  }): Promise<Contact> {
    return apiClient.post<Contact>('/crm/contacts', data);
  },

  /**
   * Update contact
   */
  async updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
    return apiClient.put<Contact>(`/crm/contacts/${id}`, data);
  },

  /**
   * Delete contact
   */
  async deleteContact(id: string): Promise<void> {
    return apiClient.delete(`/crm/contacts/${id}`);
  },

  /**
   * Get contacts for account
   */
  async getAccountContacts(accountId: string): Promise<Contact[]> {
    return apiClient.get<Contact[]>(`/crm/contacts?accountId=${accountId}`);
  },

  // ============================================================================
  // Lead Operations
  // ============================================================================

  /**
   * Get all leads for tenant
   */
  async getLeads(tenantId: string): Promise<Lead[]> {
    return apiClient.get<Lead[]>(`/crm/leads/${tenantId}`);
  },

  /**
   * Create new lead
   */
  async createLead(data: {
    contactId?: string;
    accountId?: string;
    source: string;
    status?: string;
    description?: string;
  }): Promise<Lead> {
    return apiClient.post<Lead>('/crm/leads', data);
  },

  /**
   * Update lead status
   */
  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    return apiClient.put<Lead>(`/crm/leads/${id}`, data);
  },

  // ============================================================================
  // Note Operations
  // ============================================================================

  /**
   * Get notes for contact
   */
  async getNotes(contactId: string): Promise<CustomerNote[]> {
    return apiClient.get<CustomerNote[]>(`/crm/notes/${contactId}`);
  },

  /**
   * Create new note
   */
  async createNote(data: {
    contactId: string;
    content: string;
  }): Promise<CustomerNote> {
    return apiClient.post<CustomerNote>('/crm/notes', data);
  },

  // ============================================================================
  // Property Operations
  // ============================================================================

  /**
   * Get all properties (optionally filtered by accountId)
   */
  async getProperties(accountId?: string): Promise<any[]> {
    const params = accountId ? `?accountId=${accountId}` : '';
    return apiClient.get<any[]>(`/properties${params}`);
  },

  /**
   * Get single property by ID
   */
  async getProperty(id: string): Promise<any> {
    return apiClient.get<any>(`/properties/${id}`);
  },

  /**
   * Create new property
   */
  async createProperty(data: any): Promise<any> {
    return apiClient.post<any>('/properties', data);
  },

  /**
   * Update property
   */
  async updateProperty(id: string, data: any): Promise<any> {
    return apiClient.put<any>(`/properties/${id}`, data);
  },

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    return apiClient.delete(`/properties/${id}`);
  },
};
