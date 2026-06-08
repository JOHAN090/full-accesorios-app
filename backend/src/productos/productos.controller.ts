import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Público - cualquier usuario puede listar y ver productos
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoria_id') categoria_id?: number,
    @Query('search') search?: string,
    @Query('en_oferta') en_oferta?: number,
  ) {
    return this.productosService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      categoria_id: categoria_id ? Number(categoria_id) : undefined,
      search,
      en_oferta: en_oferta !== undefined ? Number(en_oferta) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // Solo Admin y Editor pueden crear productos
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `producto-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          callback(new Error('Solo se permiten archivos de imagen'), false);
        } else {
          callback(null, true);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createProductoDto.imagen_url = `/uploads/${file.filename}`;
    }
    return this.productosService.create(createProductoDto);
  }

  // Solo Admin y Editor pueden actualizar productos
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `producto-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          callback(new Error('Solo se permiten archivos de imagen'), false);
        } else {
          callback(null, true);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateProductoDto.imagen_url = `/uploads/${file.filename}`;
    }
    return this.productosService.update(id, updateProductoDto);
  }

  // Solo Admin puede eliminar productos
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.softDelete(id);
  }

  // Solo Admin puede restaurar productos eliminados
  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.restore(id);
  }

  // Solo Admin puede gestionar ofertas
  @Patch(':id/oferta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateOferta(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { en_oferta: number; precio_oferta?: number },
  ) {
    return this.productosService.update(id, {
      en_oferta: body.en_oferta,
      precio_oferta: body.precio_oferta,
    });
  }
}
