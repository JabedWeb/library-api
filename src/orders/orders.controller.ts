import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { existsSync } from 'fs';
import { join } from 'path';

import { OrdersService } from './orders.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { Response } from 'express';
import { Res } from '@nestjs/common';
import { PdfService } from '../pdf/pdf.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Borrow book',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  create(
    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.ordersService.remove(id);
  }
  @Get(':id/pdf')
  async downloadPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const order = await this.ordersService.findOne(id);
    const pdfPath = (order as { pdfPath?: string }).pdfPath;

    if (pdfPath) {
      const savedPdfPath = join(process.cwd(), pdfPath.replace(/^\//, ''));

      if (existsSync(savedPdfPath)) {
        return res.download(savedPdfPath, `order-${id}.pdf`);
      }
    }

    const pdf = await this.pdfService.generateOrderPdf(order);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=order-${id}.pdf`,
    });

    res.send(pdf);
  }
}
