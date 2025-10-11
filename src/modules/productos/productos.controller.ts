import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductoService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/constants/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  create(@Body() dto: CreateProductoDto, @Req() req) {
    const usuarioId = req.user.id;
    return this.productoService.create(dto, usuarioId);
  }

  @Roles(Role.REPRESENTANTE)
  @Post('representante')
  @ApiOperation({
    summary: 'Crear un producto (solo para representantes)',
    description:
      'Permite a un representante crear productos únicamente en las tiendas asignadas a él.',
  })
  async createByRepresentante(@Body() dto: CreateProductoDto, @Req() req: any) {
    const representanteId = req.user.userId;
    return this.productoService.createByRepresentante(dto, representanteId);
  }

  @Roles(Role.REPRESENTANTE)
  @Get('mis-productos')
  @ApiOperation({
    summary:
      'Listar los productos de las tiendas del representante autenticado',
  })
  async findMisProductos(@Req() req) {
    return this.productoService.findByRepresentante(req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los productos' })
  findAll() {
    return this.productoService.findAll();
  }

  @Get('representante/:id')
  @Roles(Role.REPRESENTANTE)
  @ApiOperation({
    summary:
      'Obtener un producto específico de una tienda del representante autenticado',
  })
  findOneByRepresentante(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') representanteId: number,
  ) {
    return this.productoService.findOneByRepresentante(id, representanteId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener detalles de un producto por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findOne(id);
  }

  @Patch('representante/:id')
@Roles(Role.REPRESENTANTE)
@ApiOperation({ summary: 'Actualizar un producto perteneciente a una tienda del representante autenticado' })
async updateByRepresentante(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateProductoDto,
  @User('userId') representanteId: number,
) {
  return this.productoService.updateByRepresentante(id, dto, representanteId);
}

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
  ) {
    return this.productoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.remove(id);
  }
}
