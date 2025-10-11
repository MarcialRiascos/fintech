import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tiendas')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Crear una tienda',
    description: 'Permite crear una nueva tienda asignada por un usuario administrador o super administrador.',
  })
  create(@Body() dto: CreateTiendaDto, @Req() req: any) {
    const asignadoPorId = req.user.userId;
    return this.tiendasService.create(dto, asignadoPorId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las tiendas',
    description: 'Devuelve una lista completa de las tiendas registradas en el sistema.',
  })
  findAll() {
    return this.tiendasService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una tienda por ID',
    description: 'Permite consultar la información de una tienda específica mediante su ID.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tienda',
    description: 'Permite modificar los datos de una tienda existente.',
  })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.REPRESENTANTE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTiendaDto,
    @Req() req: any,
  ) {
    const asignadoPorId = req.user.userId;
    return this.tiendasService.update(id, dto, asignadoPorId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tienda',
    description: 'Elimina una tienda del sistema según su ID.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.remove(id);
  }
}
