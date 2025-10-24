/**
 * CRM Store
 * Zustand store for CRM (accounts, contacts, leads) state management
 */

import { create } from 'zustand';
import { crmService } from '../services';
import type { Account, Contact, Lead, CustomerNote } from '../types';

interface CRMState {
  // Account state
  accounts: Account[];
  selectedAccount: Account | null;
  
  // Contact state
  contacts: Contact[];
  selectedContact: Contact | null;
  
  // Lead state
  leads: Lead[];
  selectedLead: Lead | null;
  
  // Note state
  notes: CustomerNote[];
  
  // UI state
  isLoading: boolean;
  error: string | null;

  // Account Actions
  fetchAccounts: (tenantId: string) => Promise<void>;
  fetchAccount: (id: string) => Promise<void>;
  createAccount: (data: { name: string; type: 'RESIDENTIAL' | 'COMMERCIAL' }) => Promise<Account>;
  updateAccount: (id: string, data: Partial<Account>) => Promise<void>;
  setSelectedAccount: (account: Account | null) => void;
  
  // Contact Actions
  fetchContacts: (tenantId: string) => Promise<void>;
  fetchContact: (id: string) => Promise<void>;
  createContact: (data: { firstName: string; lastName: string; email?: string; phone?: string; accountId?: string }) => Promise<Contact>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  setSelectedContact: (contact: Contact | null) => void;
  
  // Lead Actions
  fetchLeads: (tenantId: string) => Promise<void>;
  createLead: (data: { contactId?: string; accountId?: string; source: string; status?: string; description?: string }) => Promise<Lead>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  setSelectedLead: (lead: Lead | null) => void;
  
  // Note Actions
  fetchNotes: (contactId: string) => Promise<void>;
  createNote: (data: { contactId: string; content: string }) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

export const useCRMStore = create<CRMState>((set) => ({
  // Initial state
  accounts: [],
  selectedAccount: null,
  
  contacts: [],
  selectedContact: null,
  
  leads: [],
  selectedLead: null,
  
  notes: [],
  
  isLoading: false,
  error: null,

  // ============================================================================
  // Account Actions
  // ============================================================================

  fetchAccounts: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const accounts = await crmService.getAccounts(tenantId);
      set({ accounts, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch accounts',
        isLoading: false,
      });
    }
  },

  fetchAccount: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const account = await crmService.getAccount(id);
      set({ selectedAccount: account, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch account',
        isLoading: false,
      });
    }
  },

  createAccount: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const account = await crmService.createAccount(data);
      set((state) => ({
        accounts: [account, ...state.accounts],
        isLoading: false,
      }));
      return account;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create account',
        isLoading: false,
      });
      throw error;
    }
  },

  updateAccount: async (id: string, data: Partial<Account>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedAccount = await crmService.updateAccount(id, data);
      
      set((state) => ({
        accounts: state.accounts.map((acc) => (acc.id === id ? updatedAccount : acc)),
        selectedAccount: state.selectedAccount?.id === id ? updatedAccount : state.selectedAccount,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update account',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedAccount: (account: Account | null) => {
    set({ selectedAccount: account });
  },

  // ============================================================================
  // Contact Actions
  // ============================================================================

  fetchContacts: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const contacts = await crmService.getContacts(tenantId);
      set({ contacts, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contacts',
        isLoading: false,
      });
    }
  },

  fetchContact: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const contact = await crmService.getContact(id);
      set({ selectedContact: contact, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contact',
        isLoading: false,
      });
    }
  },

  createContact: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const contact = await crmService.createContact(data);
      set((state) => ({
        contacts: [contact, ...state.contacts],
        isLoading: false,
      }));
      return contact;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create contact',
        isLoading: false,
      });
      throw error;
    }
  },

  updateContact: async (id: string, data: Partial<Contact>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedContact = await crmService.updateContact(id, data);
      
      set((state) => ({
        contacts: state.contacts.map((con) => (con.id === id ? updatedContact : con)),
        selectedContact: state.selectedContact?.id === id ? updatedContact : state.selectedContact,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update contact',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedContact: (contact: Contact | null) => {
    set({ selectedContact: contact });
  },

  // ============================================================================
  // Lead Actions
  // ============================================================================

  fetchLeads: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const leads = await crmService.getLeads(tenantId);
      set({ leads, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch leads',
        isLoading: false,
      });
    }
  },

  createLead: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const lead = await crmService.createLead(data);
      set((state) => ({
        leads: [lead, ...state.leads],
        isLoading: false,
      }));
      return lead;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create lead',
        isLoading: false,
      });
      throw error;
    }
  },

  updateLead: async (id: string, data: Partial<Lead>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedLead = await crmService.updateLead(id, data);
      
      set((state) => ({
        leads: state.leads.map((lead) => (lead.id === id ? updatedLead : lead)),
        selectedLead: state.selectedLead?.id === id ? updatedLead : state.selectedLead,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update lead',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedLead: (lead: Lead | null) => {
    set({ selectedLead: lead });
  },

  // ============================================================================
  // Note Actions
  // ============================================================================

  fetchNotes: async (contactId: string) => {
    try {
      set({ isLoading: true, error: null });
      const notes = await crmService.getNotes(contactId);
      set({ notes, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch notes',
        isLoading: false,
      });
    }
  },

  createNote: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const note = await crmService.createNote(data);
      set((state) => ({
        notes: [note, ...state.notes],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create note',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
