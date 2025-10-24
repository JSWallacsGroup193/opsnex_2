import { Controller, Get, Post, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CrmService } from './service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly service: CrmService) {}

  @Get('accounts')
  getAccounts(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getAccounts(tenantId);
  }

  @Get('accounts/:id')
  getAccount(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getAccount(id, tenantId);
  }

  @Post('accounts')
  createAccount(@Body() body: { name: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createAccount({ ...body, tenantId });
  }

  @Put('accounts/:id')
  updateAccount(@Param('id') id: string, @Body() body: { name?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.updateAccount(id, body, tenantId);
  }

  @Get('contacts')
  getContacts(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getContacts(tenantId);
  }

  @Get('contacts/:id')
  getContact(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getContact(id, tenantId);
  }

  @Post('contacts')
  createContact(@Body() body: { name: string; email?: string; phone?: string; accountId?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createContact({ ...body, tenantId });
  }

  @Put('contacts/:id')
  updateContact(@Param('id') id: string, @Body() body: { name?: string; email?: string; phone?: string; accountId?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.updateContact(id, body, tenantId);
  }

  @Get('leads')
  getLeads(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getLeads(tenantId);
  }

  @Post('leads')
  createLead(@Body() body: { contactId?: string; accountId?: string; status?: string; source?: string; description?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createLead({ ...body, tenantId });
  }

  @Put('leads/:id')
  updateLead(@Param('id') id: string, @Body() body: { contactId?: string; accountId?: string; status?: string; source?: string; description?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.updateLead(id, body, tenantId);
  }

  @Get('notes/contact/:contactId')
  getNotes(@Param('contactId') contactId: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getNotes(contactId, tenantId);
  }

  @Post('notes')
  createNote(@Body() body: { contactId: string; content: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createNote({ ...body, tenantId });
  }
}
