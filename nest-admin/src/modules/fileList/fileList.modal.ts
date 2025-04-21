import { ApiProperty } from '@nestjs/swagger'

export class FileListInfo {
  @ApiProperty({ description: '文件名' })
  name: string

  @ApiProperty({ description: '类型' })
  type: 'folder' | 'file'

  @ApiProperty({ description: '路径' })
  path: string

  @ApiProperty({ description: 'id' })
  id: number

  @ApiProperty({ type: [FileListInfo] })
  children?: FileListInfo[]

  @ApiProperty({ description: '上级路径' })
  parentPath: string

  @ApiProperty({ description: '文件大小' })
  size: number

  @ApiProperty({ description: '最后修改时间' })
  mtime: string

  @ApiProperty({ description: 'description' })
  ctime: string
}
