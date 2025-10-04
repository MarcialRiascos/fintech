import { IsNumber } from 'class-validator';

export class UpdateEstadoCuentaDto {
  @IsNumber()
  estadoId: number;
}
