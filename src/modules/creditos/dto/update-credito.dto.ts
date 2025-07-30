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
  usuarios_id: number; // Cliente

  @IsNotEmpty()
  @IsNumber()
  estados_id: number;
}
