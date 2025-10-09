import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Roles(Role.RECAUDADOR)
  @Post()
  async create(@Body() dto: CreatePagoDto, @User() user: any) {
    return this.pagosService.create(dto, user.userId);
  }

  @Roles(Role.RECAUDADOR)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos registrados' })
  findAll() {
    return this.pagosService.findAll();
  }

  @Roles(Role.RECAUDADOR)
  @Get('recaudador/:recaudadorId')
  @ApiOperation({
    summary:
      'Obtener todos los pagos asociados a un ID de recaudador (usuario)',
  })
  findByRecaudador(@Param('recaudadorId', ParseIntPipe) recaudadorId: number) {
    return this.pagosService.findByRecaudador(recaudadorId);
  }

  @Roles(Role.RECAUDADOR)
  @Get('mis-pagos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener todos los pagos del usuario con sesión iniciada',
  })
  findMyPayments(@User('userId') userId: number) {
    return this.pagosService.findByRecaudador(userId);
  }

  @Roles(Role.RECAUDADOR)
  @Get('usuario/:usuarioId')
  @ApiOperation({
    summary:
      'Obtener todos los pagos de un recaudador específico',
  })
  findPaymentsByUser(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.pagosService.findByRecaudador(usuarioId);
  }

  @Roles(Role.CLIENTE)
  @Get('cliente')
   @ApiOperation({
    summary:
      'Obtener todos los pagos de un cliente con sesion iniciada',
  })
  async getPagosCliente(@User() user: any) {
    if(user.rol == 'Cliente'){
      user.rol = 3;
    }
    return this.pagosService.findPagosByCliente(user.userId, user.rol);
  }
}
