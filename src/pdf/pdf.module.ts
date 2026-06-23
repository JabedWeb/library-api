import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Global } from '@nestjs/common';

@Global()
@Module({
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
