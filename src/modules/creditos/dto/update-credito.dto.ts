import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCreditoDto {
  @ApiProperty({
    description: 'Código único del crédito (por ejemplo: CRD-2025-001)',
    example: 'CRD-2025-001',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ApiProperty({
    description: 'Monto total del crédito en pesos colombianos',
    example: 1500000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @ApiProperty({
    description: 'Valor de la cuota de pago del crédito',
    example: 150000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  cuota_pago: number;

  @ApiProperty({
    description: 'ID del usuario al que se asigna el crédito (cliente)',
    example: 12,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  usuarios_id: number; // Cliente

  @ApiProperty({
    description:
      'ID del estado inicial del crédito (por ejemplo: activo, pendiente, etc.)',
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  estados_id: number;
}
