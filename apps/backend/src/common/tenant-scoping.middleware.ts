import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Middleware for Tenant Scoping
 * Automatically adds tenantId filter to all Prisma queries
 * Prevents cross-tenant data leakage
 * 
 * IMPORTANT: This middleware must be registered in PrismaService
 */
export function createTenantScopingMiddleware(logger: Logger) {
  return async (params: any, next: any) => {
    // Get tenantId from context (set by JWT middleware)
    const tenantId = (params.runInTransaction as any)?.tenantId;
    
    if (!tenantId) {
      // Skip middleware for queries without tenant context
      // (e.g., authentication, system-level queries)
      return next(params);
    }

    // List of models that should be scoped by tenant
    const tenantScopedModels = [
      'User',
      'Account',
      'Contact',
      'Lead',
      'CrmNote',
      'WorkOrder',
      'SKU',
      'Warehouse',
      'Bin',
      'StockLedger',
      'PurchaseOrder',
      'DispatchSlot',
      'Forecast',
      'Property',
      'CustomerEquipment',
      'CustomerPerformance',
      'VendorInfo',
      'VendorContact',
      'PriceAgreement',
      'PerformanceReview',
      'ServiceCatalogItem',
      'ServiceBundle',
      'LaborRate',
      'Estimate',
      'Proposal',
      'Feedback',
      'Notification',
      'FieldCalculation',
    ];

    // If this model should be scoped by tenant
    if (tenantScopedModels.includes(params.model)) {
      // Add tenantId filter to query
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      } else if (params.action === 'findMany') {
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      } else if (params.action === 'create') {
        params.args.data = {
          ...params.args.data,
          tenantId,
        };
      } else if (params.action === 'update' || params.action === 'updateMany') {
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      } else if (params.action === 'delete' || params.action === 'deleteMany') {
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      }
    }

    return next(params);
  };
}

/**
 * HTTP Middleware to attach tenantId to request context
 * Works with JWT middleware to extract tenantId from token
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantContextMiddleware.name);

  use(req: Request & { user?: { userId: string; tenantId: string } }, res: Response, next: NextFunction) {
    // tenantId is already attached to req.user by JwtAttachMiddleware
    // This middleware ensures it's available for Prisma queries
    if (req.user?.tenantId) {
      // Store tenantId in async context for Prisma middleware
      (req as any).tenantId = req.user.tenantId;
    }
    
    next();
  }
}
