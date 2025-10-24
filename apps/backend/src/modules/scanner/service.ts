import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ScannerService {
  constructor(private readonly prisma: PrismaService) {}

  async scan(tenantId: string, barcode: string) {
    // Exact barcode first
    const sku = await this.prisma.sKU.findFirst({
      where: { tenantId, OR: [{ barcode }, { name: barcode }] },
    });

    if (sku) return { found: true, sku };

    // Fallback fuzzy
    const fuzzy = await this.prisma.sKU.findFirst({
      where: {
        tenantId,
        OR: [
          { description: { contains: barcode, mode: 'insensitive' } },
          { name: { contains: barcode, mode: 'insensitive' } },
        ],
      },
    });
    if (fuzzy) return { found: true, sku: fuzzy };
    return { found: false };
  }
}
