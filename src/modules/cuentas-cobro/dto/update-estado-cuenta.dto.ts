import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateEstadoCuentaDto {
  @ApiProperty({
    example: 2,
    description: 'ID del nuevo estado que se asignará a la cuenta de cobro.',
  })
  @IsNumber()
  estadoId: number;
}
