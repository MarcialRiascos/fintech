import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  monto_pagado: number;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsNumber()
  orden_compra_id: number;

  @IsNotEmpty()
  @IsNumber()
  asignado_por_id: number; 
}
