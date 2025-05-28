import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = morgan('dev'); // puedes cambiar a 'combined', 'tiny', etc.

  use(req: Request, res: Response, next: NextFunction): void {
    this.logger(req, res, next);
  }
}