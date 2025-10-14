// src/modules/usuarios/usuarios.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  HttpStatus,
  HttpException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { instanceToPlain } from 'class-transformer';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Role } from '../../common/constants/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadCsvDto } from './dto/upload-csv.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  async obtenerTodos(): Promise<any> {
    const response = await this.usuariosService.findAll();

    // Aquí solo transformamos los usuarios (response.data)
    const plainUsuarios = instanceToPlain(response.data);

    return {
      message: response.message,
      data: plainUsuarios,
    };
  }

  @Get(':identificador')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Obtener un usuario por contrato o dni' })
  async findOne(
    @Param('identificador') identificador: string,
  ): Promise<{ message: string; data: any }> {
    return await this.usuariosService.findByContratoODni(identificador);
  }

  @Post('registro')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Registrar usuarios' })
async crear(@Body() dto: CreateUsuarioDto): Promise<{ message: string }> {
  await this.usuariosService.create(dto);
  return {
    message: 'Registro exitoso',
  };
  }

  @Post('importar-csv')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Registrar usuarios desde CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadCsvDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const ext = extname(file.originalname);
          const name = `usuarios-${Date.now()}${ext}`;
          cb(null, name);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (file.mimetype !== 'text/csv') {
          return cb(new Error('El archivo debe ser un CSV'), false);
        }
        cb(null, true);
      },
    }),
  )
  async importarCsv(@UploadedFile() file: Express.Multer.File) {
    const usuarios = await this.usuariosService.registrarUsuariosDesdeCsv(
      file.path,
    );
    return {
      message: 'Usuarios registrados/actualizados desde CSV',
      /* data: usuarios, */
    };
  }

  @Patch(':identificador')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario por contrato o DNI' })
  @ApiParam({
    name: 'identificador',
    description: 'Número de contrato o DNI del usuario',
  })
  @ApiBody({ type: UpdateUsuarioDto })
  async actualizarPorIdentificador(
    @Param('identificador') identificador: string,
    @Body() dto: UpdateUsuarioDto,
  ): Promise<{ message: string }> {
    return this.usuariosService.updateByIdentificador(identificador, dto);
  }

  /* @Delete(':contrato')
  @ApiOperation({ summary: 'Eliminar un usuario por contrato' })
  async eliminarUsuario(
    @Param('contrato') contrato: string,
  ): Promise<{ message: string }> {
    const resultado = await this.usuariosService.eliminarPorContrato(contrato);
    if (!resultado) {
      throw new HttpException(
        `Usuario con contrato ${contrato} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: `Usuario con contrato ${contrato} eliminado correctamente`,
    };
  } */
}
