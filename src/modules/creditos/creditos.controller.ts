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
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('creditos')
export class CreditosController {
  constructor(private readonly creditosService: CreditosService) {}

  @Roles(Role.SUPER_ADMIN)
  @Post()
  async create(@Body() createCreditoDto: CreateCreditoDto, @Req() req: any) {
    const asignadorId = req.user.userId; // <- Esto viene del payload JWT
    return this.creditosService.create(createCreditoDto, asignadorId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  findAll() {
    return this.creditosService.findAll();
  }

  @Roles(Role.CLIENTE)
  @Get('mis-creditos')
  findMyCredits(@User('userId') userId: number) {
    return this.creditosService.findByUser(userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.creditosService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCreditoDto,
    @Req() req: any,
  ) {
    const asignadorId = req.user.userId; // <- viene del payload JWT
    return this.creditosService.update(id, dto, asignadorId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.creditosService.remove(id);
  }
}
