import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  getRoot(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', '..', '..', 'frontend', 'dist', 'index.html'));
  }
}
