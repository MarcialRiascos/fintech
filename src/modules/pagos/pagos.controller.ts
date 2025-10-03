import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RECAUDADOR)
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

 @Post()
async create(@Body() dto: CreatePagoDto, @User() user: any) {
  return this.pagosService.create(dto, user.userId);
}

  
 @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos registrados' })
  findAll() {
    return this.pagosService.findAll();
  }

  // Endpoint 2: GET /pagos/recaudador/:recaudadorId
  @Get('recaudador/:recaudadorId')
  @ApiOperation({ summary: 'Obtener todos los pagos asociados a un ID de recaudador (usuario)' })
  findByRecaudador(@Param('recaudadorId', ParseIntPipe) recaudadorId: number) {
    return this.pagosService.findByRecaudador(recaudadorId);
  }

  @Get('mis-pagos')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Obtener todos los pagos del usuario con sesión iniciada' })
findMyPayments(@User('userId') userId: number) {
  return this.pagosService.findByRecaudador(userId);
}
}
