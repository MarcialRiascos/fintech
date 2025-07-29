import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCreditoDto  {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @IsNotEmpty()
  @IsNumber()
  cuota_pago: number;

  @IsNotEmpty()
  @IsNumber()
  usuarios_id: number; // beneficiario

  @IsNotEmpty()
  @IsNumber()
  usuarios_id1: number; // asignado por

  @IsNotEmpty()
  @IsNumber()
  estados_id: number;
}
