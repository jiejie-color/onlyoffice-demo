import { Module } from '@nestjs/common';

import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OnlyofficeService } from '../onlyoffice/onlyoffice.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, OnlyofficeService],
  imports: [JwtModule],
})
export class DocumentModule {}
