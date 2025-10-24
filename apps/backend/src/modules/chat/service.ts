import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key',
});

const prisma = new PrismaClient();

@Injectable()

export class ChatService {
  async ask(prompt: string, tenantContext?: string) {
    const context = tenantContext ? `Tenant Info: ${tenantContext}\n` : '';
    
    let contextText = '';
    if (tenantContext) {
      const match = tenantContext.match(/Tenant ID: (\S+)/);
      const tenantId = match?.[1] || '';

      if (/stock|inventory|sku/i.test(prompt)) {
        const skus = await prisma.sKU.findMany({
          where: { tenantId },
          include: {
            ledgers: true,
          }
        });
        const skuSummaries = skus.map(s => {
          const qty = s.ledgers.reduce((sum, l) => sum + (l.direction === 'IN' ? l.quantity : -l.quantity), 0);
          return `${s.name}: ${qty}`;
        });
        contextText += `\nInventory Summary:\n` + skuSummaries.join('\n');
      }

      if (/contact|lead|account/i.test(prompt)) {
        const [accounts, contacts, leads] = await Promise.all([
          prisma.account.count({ where: { tenantId } }),
          prisma.contact.count({ where: { tenantId } }),
          prisma.lead.count({ where: { tenantId } }),
        ]);
        contextText += `\nCRM Summary:\nAccounts: ${accounts}, Contacts: ${contacts}, Leads: ${leads}`;
      }

      if (/purchase|order|po/i.test(prompt)) {
        const pos = await prisma.purchaseOrder.findMany({
          where: { tenantId },
          include: { sku: true }
        });
        const openPOs = pos.filter(p => p.status === 'OPEN');
        const poSummary = openPOs.map(p => `${p.sku.name}: ${p.quantity}`).join(', ');
        contextText += `\nOpen POs: ${openPOs.length}\nItems: ${poSummary}\n`;
      }

      if (/forecast|rop|reorder/i.test(prompt)) {
        const forecasts = await prisma.forecast.findMany({
          where: { tenantId },
          include: { sku: true }
        });
        const lowStock = forecasts
          .filter(f => f.suggestedOrderQty > 0)
          .map(f => `${f.sku.name}: ROP=${f.reorderPoint.toFixed(1)}, SOQ=${f.suggestedOrderQty}`);
        contextText += `\nForecast Summary:\n` + lowStock.join('\n');
      }
    }

    const fullPrompt = contextText + '\n' + context + prompt;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an assistant for an HVAC company.' },
        { role: 'user', content: fullPrompt },
      ],
    });

    const result = response.choices[0].message?.content;
    if (tenantContext) {
      const match = tenantContext.match(/Tenant ID: (\S+)/);
      const tenantId = match?.[1] || '';
      await prisma.chatLog.create({ data: { tenantId, userPrompt: prompt, aiResponse: result || '' } });
    }
    return result;
  }

  async getLogs(tenantId: string) {
    return await prisma.chatLog.findMany({ 
      where: { tenantId }, 
      orderBy: { createdAt: 'desc' } 
    });
  }
}
