import { Controller } from '@nestjs/common';
import { EstratosService } from './estratos.service';

@Controller('estratos')
export class EstratosController {
  constructor(private readonly estratosService: EstratosService) {}
}
