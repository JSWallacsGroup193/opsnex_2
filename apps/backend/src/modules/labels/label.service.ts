import { Injectable } from '@nestjs/common';

@Injectable()
export class LabelService {
  generateZPL(skuName: string, barcode: string): string {
    return `
^XA
^FO50,50^ADN,36,20^FD${skuName}^FS
^FO50,100^BCN,100,Y,N,N
^FD${barcode}^FS
^XZ`;
  }
}
