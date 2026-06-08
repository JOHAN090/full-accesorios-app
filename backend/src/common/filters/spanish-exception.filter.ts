import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class SpanishExceptionFilter implements ExceptionFilter {
  // Map of English NestJS messages to Spanish translations
  private readonly translations: Record<string, string> = {
    'Forbidden resource': 'No tienes permisos para acceder a este recurso',
    'Forbidden': 'Acceso denegado',
    'Unauthorized': 'No autorizado. Inicia sesión para continuar',
    'Not Found': 'Recurso no encontrado',
    'Bad Request': 'Solicitud inválida',
    'Internal server error': 'Error interno del servidor',
    'Internal Server Error': 'Error interno del servidor',
    'Conflict': 'Conflicto con los datos existentes',
    'Method Not Allowed': 'Método no permitido',
    'Payload Too Large': 'El archivo es demasiado grande',
    'Unsupported Media Type': 'Tipo de archivo no soportado',
    'Too Many Requests': 'Demasiadas solicitudes. Intenta más tarde',
    'Service Unavailable': 'Servicio no disponible temporalmente',
    'Gateway Timeout': 'Tiempo de espera agotado',
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';
    let error = 'Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = this.translate(exceptionResponse);
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        // Translate the message
        if (Array.isArray(resp.message)) {
          message = resp.message.map((msg: string) => this.translate(msg));
        } else {
          message = this.translate(resp.message || resp.error || 'Error desconocido');
        }
        error = this.translate(resp.error || 'Error');
      }
    } else if (exception instanceof Error) {
      message = exception.message || 'Error interno del servidor';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: this.translate(error),
      timestamp: new Date().toISOString(),
    });
  }

  private translate(text: string): string {
    if (!text) return text;
    return this.translations[text] || text;
  }
}
