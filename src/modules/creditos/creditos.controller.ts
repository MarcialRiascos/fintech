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
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('creditos')
export class CreditosController {
  constructor(private readonly creditosService: CreditosService) {}

  @Roles(Role.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo crédito (solo SUPER_ADMIN)' })
  async create(@Body() createCreditoDto: CreateCreditoDto, @Req() req: any) {
    const asignadorId = req.user.userId; // <- Esto viene del payload JWT
    return this.creditosService.create(createCreditoDto, asignadorId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los créditos (SUPER_ADMIN y ADMIN)' })
  findAll() {
    return this.creditosService.findAll();
  }

  @Roles(Role.CLIENTE)
  @Get('mis-creditos')
  @ApiOperation({ summary: 'Obtener créditos del cliente autenticado' })
  findMyCredits(@User('userId') userId: number) {
    return this.creditosService.findByUser(userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('asignados')
  @ApiOperation({
    summary: 'Obtener créditos asignados por el usuario autenticado',
  })
  async findAssignedCredits(@User('userId') userId: number) {
    return this.creditosService.findByAsignador(userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un crédito específico por su ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.creditosService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información de un crédito' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCreditoDto,
    @Req() req: any,
  ) {
    const asignadorId = req.user.userId; // <- viene del payload JWT
    return this.creditosService.update(id, dto, asignadorId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un crédito por su ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.creditosService.remove(id);
  }
}
