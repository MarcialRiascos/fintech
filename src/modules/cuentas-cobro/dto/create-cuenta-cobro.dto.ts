// src/modules/cuentas-cobro/dto/create-cuenta-cobro.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCuentaCobroDto {
  @IsNotEmpty()
  @IsNumber()
  tienda_id: number;
}
