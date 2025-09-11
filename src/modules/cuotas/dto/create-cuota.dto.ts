import { IsNumber, IsDateString } from 'class-validator';

export class CreateCuotaDto {
  @IsNumber()
  numero_cuota: number;

  @IsNumber()
  valor_cuota: number;

  @IsNumber()
  saldo_cuota: number;

  @IsDateString()
  fecha_vencimiento: Date;

  @IsNumber()
  orden_compra_id: number;

  @IsNumber()
  estado_id: number;
}
