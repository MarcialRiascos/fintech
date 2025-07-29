import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreditosService } from './creditos.service';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('creditos')
export class CreditosController {
  constructor(private readonly creditosService: CreditosService) {}

 @Post()
  async create(@Body() createCreditoDto: CreateCreditoDto, @Req() req: any) {
    const asignadorId = req.user.userId; // <- Esto viene del payload JWT
    return this.creditosService.create(createCreditoDto, asignadorId);
  }


  @Get()
  findAll() {
    return this.creditosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.creditosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCreditoDto) {
    return this.creditosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.creditosService.remove(id);
  }
}
