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
  ForbiddenException,
} from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tiendas')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Crear una tienda',
    description:
      'Permite crear una nueva tienda asignada por un usuario administrador o super administrador.',
  })
  create(@Body() dto: CreateTiendaDto, @Req() req: any) {
    const asignadoPorId = req.user.userId;
    return this.tiendasService.create(dto, asignadoPorId);
  }

  @Get('representante')
  @Roles(Role.REPRESENTANTE)
  @ApiOperation({
    summary: 'Listar tiendas del representante autenticado',
    description: `Obtiene todas las tiendas asociadas al representante que tiene sesión iniciada.  
    Solo disponible para usuarios con rol 4.`,
  })
  async findAllByRepresentante(@User() user: any) {
    return this.tiendasService.findAllByRepresentante(user);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CLIENTE)
  @ApiOperation({
    summary: 'Listar todas las tiendas',
    description:
      'Devuelve una lista completa de las tiendas registradas en el sistema.',
  })
  findAll() {
    return this.tiendasService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CLIENTE)
  @ApiOperation({
    summary: 'Obtener una tienda por ID',
    description:
      'Permite consultar la información de una tienda específica mediante su ID.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tienda',
    description: 'Permite modificar los datos de una tienda existente.',
  })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTiendaDto,
    @Req() req: any,
  ) {
    const asignadoPorId = req.user.userId;
    return this.tiendasService.update(id, dto, asignadoPorId);
  }

   @Patch('representante/:id')
   @Roles(Role.REPRESENTANTE)
  @ApiOperation({
    summary: 'Actualizar tienda del representante autenticado',
    description:
      'Permite al representante (rol 4) actualizar únicamente las tiendas que le pertenecen.',
  })
  async updateOwnStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTiendaDto,
    @User() user: any,
  ) {
    if (user.rol !== 'Representante') {
      throw new ForbiddenException(
        'Acceso denegado: solo los representantes pueden usar este recurso.',
      );
    }

    return this.tiendasService.updateByRepresentante(id, dto, user.userId);
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
