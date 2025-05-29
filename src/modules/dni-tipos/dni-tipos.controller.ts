import { Controller } from '@nestjs/common';
import { DniTiposService } from './dni-tipos.service';

@Controller('dni-tipos')
export class DniTiposController {
  constructor(private readonly dniTiposService: DniTiposService) {}
}
