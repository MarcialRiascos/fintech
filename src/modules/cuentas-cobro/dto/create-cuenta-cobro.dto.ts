// src/modules/cuentas-cobro/dto/create-cuenta-cobro.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCuentaCobroDto {
  @ApiProperty({
    example: 5,
    description: 'ID de la tienda para la cual se genera la cuenta de cobro.',
  })
  @IsNotEmpty()
  @IsNumber()
  tienda_id: number;
}
