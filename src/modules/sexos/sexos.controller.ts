import { Controller } from '@nestjs/common';
import { SexosService } from './sexos.service';

@Controller('sexos')
export class SexosController {
  constructor(private readonly sexosService: SexosService) {}
}
