import { Module } from '@nestjs/common'
import { FileListController } from './fileList.controller'


@Module({
  imports: [],
  controllers: [FileListController],
})
export class FileListModule { }
