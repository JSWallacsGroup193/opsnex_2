import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CrmService {
  async getAccounts(tenantId: string) {
    return prisma.account.findMany({ where: { tenantId } });
  }

  async getAccount(id: string, tenantId: string) {
    const account = await prisma.account.findFirst({ where: { id, tenantId } });
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    return account;
  }

  async createAccount(data: { tenantId: string; name: string }) {
    const accountNumber = `ACC-${Date.now()}`;
    return prisma.account.create({ 
      data: {
        ...data,
        accountNumber,
      }
    });
  }

  async updateAccount(id: string, data: { name?: string }, tenantId: string) {
    const account = await prisma.account.findFirst({ where: { id, tenantId } });
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    
    return prisma.account.update({
      where: { id },
      data,
    });
  }

  async getContacts(tenantId: string) {
    return prisma.contact.findMany({ where: { tenantId } });
  }

  async getContact(id: string, tenantId: string) {
    const contact = await prisma.contact.findFirst({ where: { id, tenantId } });
    if (!contact) throw new NotFoundException(`Contact with ID ${id} not found`);
    return contact;
  }

  async createContact(data: { tenantId: string; name: string; email?: string; phone?: string; accountId?: string }) {
    // Verify accountId belongs to same tenant if provided
    if (data.accountId) {
      const account = await prisma.account.findFirst({ where: { id: data.accountId, tenantId: data.tenantId } });
      if (!account) throw new NotFoundException(`Account with ID ${data.accountId} not found`);
    }
    return prisma.contact.create({ data });
  }

  async updateContact(id: string, data: { name?: string; email?: string; phone?: string; accountId?: string }, tenantId: string) {
    const contact = await prisma.contact.findFirst({ where: { id, tenantId } });
    if (!contact) throw new NotFoundException(`Contact with ID ${id} not found`);
    
    // Verify accountId belongs to same tenant if being updated
    if (data.accountId) {
      const account = await prisma.account.findFirst({ where: { id: data.accountId, tenantId } });
      if (!account) throw new NotFoundException(`Account with ID ${data.accountId} not found`);
    }
    
    return prisma.contact.update({
      where: { id },
      data,
    });
  }

  async getLeads(tenantId: string) {
    return prisma.lead.findMany({ where: { tenantId }, include: { contact: true } });
  }

  async createLead(data: { tenantId: string; contactId?: string; accountId?: string; status?: any; source?: string; description?: string }) {
    // Verify contactId and accountId belong to same tenant if provided
    if (data.contactId) {
      const contact = await prisma.contact.findFirst({ where: { id: data.contactId, tenantId: data.tenantId } });
      if (!contact) throw new NotFoundException(`Contact with ID ${data.contactId} not found`);
    }
    if (data.accountId) {
      const account = await prisma.account.findFirst({ where: { id: data.accountId, tenantId: data.tenantId } });
      if (!account) throw new NotFoundException(`Account with ID ${data.accountId} not found`);
    }
    return prisma.lead.create({ data });
  }

  async updateLead(id: string, data: { contactId?: string; accountId?: string; status?: any; source?: string; description?: string }, tenantId: string) {
    const lead = await prisma.lead.findFirst({ where: { id, tenantId } });
    if (!lead) throw new NotFoundException(`Lead with ID ${id} not found`);
    
    // Verify contactId and accountId belong to same tenant if being updated
    if (data.contactId) {
      const contact = await prisma.contact.findFirst({ where: { id: data.contactId, tenantId } });
      if (!contact) throw new NotFoundException(`Contact with ID ${data.contactId} not found`);
    }
    if (data.accountId) {
      const account = await prisma.account.findFirst({ where: { id: data.accountId, tenantId } });
      if (!account) throw new NotFoundException(`Account with ID ${data.accountId} not found`);
    }
    
    return prisma.lead.update({
      where: { id },
      data,
    });
  }

  async getNotes(contactId: string, tenantId: string) {
    // Verify contact belongs to tenant
    const contact = await prisma.contact.findFirst({ where: { id: contactId, tenantId } });
    if (!contact) throw new NotFoundException(`Contact with ID ${contactId} not found`);
    
    return prisma.note.findMany({ where: { contactId, tenantId } });
  }

  async createNote(data: { tenantId: string; contactId: string; content: string }) {
    // Verify contact belongs to tenant
    const contact = await prisma.contact.findFirst({ where: { id: data.contactId, tenantId: data.tenantId } });
    if (!contact) throw new NotFoundException(`Contact with ID ${data.contactId} not found`);
    
    return prisma.note.create({ data });
  }
}
