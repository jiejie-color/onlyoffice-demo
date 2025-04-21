import { Module } from '@nestjs/common';

import { OnlyofficeController } from './onlyoffice.controller';
import { OnlyofficeService } from './onlyoffice.service';
import { JwtModule, } from '@nestjs/jwt';

@Module({
    controllers: [OnlyofficeController],
    providers: [OnlyofficeService],
    imports: [JwtModule],
})
export class OnlyofficeModule { }
