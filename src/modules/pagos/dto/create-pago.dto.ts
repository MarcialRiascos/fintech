import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePagoDto {
  @ApiProperty({
    description: 'Monto total pagado por el cliente.',
    example: 7533.81,
  })
  @IsNumber()
  monto_pagado: number;

  @ApiPropertyOptional({
    description:
      'Referencia del pago (puede ser un número de comprobante, transacción o código generado por la pasarela).',
    example: 'REF-2025-1002-XYZ',
  })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiProperty({
    description: 'ID de la orden de compra a la que pertenece este pago.',
    example: 3,
  })
  @IsNumber()
  orden_compra_id: number;
}
