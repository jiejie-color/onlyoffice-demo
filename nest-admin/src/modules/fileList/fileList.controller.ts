import { BadRequestException, Controller, Get, Post, Req } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileUploadDto } from '../tools/upload/upload.dto'
import { FastifyRequest } from 'fastify'
import path from 'path'
import AdmZip from 'adm-zip'
import * as fs from 'fs-extra'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { FileListInfo } from './fileList.modal'
import { getServerUtilIp } from '~/utils/serverIP.util'
const FILE_NAME = 'fileList'

@ApiTags('FileList - 文件管理')
@Controller('fileList')
export class FileListController {
  constructor() { }

  @Get('server-ip')
  @ApiOperation({ summary: '获取服务端IP' })
  @ApiResult({ type: String })
  async getServerIp(): Promise<string> {
    return getServerUtilIp()
  }
  @Post()
  @ApiOperation({ summary: '新增文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async create(@Req() req: FastifyRequest) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')
    const data = await req.file()
    if (!data.filename?.endsWith('.zip')) {
      throw new BadRequestException('仅支持ZIP格式文件')
    }
    const customName = data.filename.split('.')[0]

    const targetDir = path.join(process.cwd(), `public`, FILE_NAME, customName)
    const zipBuffer = await data.toBuffer()

    try {
      const zip = new AdmZip(zipBuffer)
      await fs.ensureDir(targetDir)
      const zipEntries = zip.getEntries()

      // 遍历所有条目，只解压文件夹内的文件
      zipEntries.forEach((entry) => {
        if (!entry.isDirectory) {
          const entryPath = entry.entryName
          // 假设 ZIP 文件里有一个根文件夹，你可以根据实际情况修改逻辑
          const pathParts = entryPath.split('/')
          if (pathParts.length > 1) {
            const relativePath = pathParts.slice(1).join(path.sep)
            const fullPath = path.join(targetDir, relativePath)
            const fileContent = entry.getData()
            fs.outputFileSync(fullPath, fileContent)
          }
        }
      })
      return true
    }
    catch (err) {
      throw new Error(`ZIP文件解压失败: ${err.message}`)
    }
  }

  @Get()
  @ApiOperation({ summary: '获取文件列表' })
  @ApiResult({ type: [FileListInfo] })
  async list() {
    try {
      const dto = {
        isChildren: 1,
        path: "/fileList"
      }
      let id = 0
      const BASEPATH = `public${dto.path}`
      const fullPath = path.join(process.cwd(), BASEPATH)
      async function traverseDirectory(currentPath: string, basePath: string = fullPath): Promise<FileListInfo[]> {
        const files = await fs.readdir(Buffer.from(currentPath) as unknown as string)
        files.sort((a, b) => {
          const aStats = fs.statSync(path.join(currentPath, a))
          const bStats = fs.statSync(path.join(currentPath, b))
          if (aStats.isDirectory() && !bStats.isDirectory())
            return -1
          if (!aStats.isDirectory() && bStats.isDirectory())
            return 1
          if (a.toLowerCase().endsWith('.exe') && !b.toLowerCase().endsWith('.exe'))
            return -1
          if (!a.toLowerCase().endsWith('.exe') && b.toLowerCase().endsWith('.exe'))
            return 1
          return a.localeCompare(b, 'zh-CN')
        })
        return (await Promise.all(
          files.map(async (file) => {
            const filename = file.toString()
            const filePath = path.join(currentPath, filename)
            const relativePath = path.relative(basePath, filePath)
            const stats = await fs.stat(filePath)
            const node: FileListInfo = {
              id: id++,
              path: `${dto.path}/${relativePath.replace(/\\/g, '/')}`,
              name: filename,
              type: stats.isDirectory() ? 'folder' : 'file',
              parentPath: path.relative(basePath, path.dirname(filePath)).replace(/\\/g, '/'), // 新增父级路径
              size: stats.isDirectory()
                ? await calculateDirectorySize(filePath) // 新增目录大小计算
                : stats.size,
              mtime: formatBeijingTime(stats.mtime), // 修改这里
              ctime: formatBeijingTime(stats.birthtime), // 修改这里
            }
            if (dto.isChildren === 1) {
              if (stats.isDirectory()) {
                return {
                  ...node,
                  children: await traverseDirectory(filePath, basePath),
                }
              }
            }
            return node
          }),
        )).filter(Boolean) // 过滤掉null值
      }

      const stats = await fs.stat(Buffer.from(fullPath) as unknown as string)
      if (stats.isDirectory()) {
        return await traverseDirectory(fullPath)
      }
      else {
        return []
      }
    }
    catch (error) {
      return []
    }
  }
}

async function calculateDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0
  const files = await fs.readdir(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stats = await fs.stat(filePath)

    if (stats.isDirectory()) {
      totalSize += await calculateDirectorySize(filePath)
    }
    else {
      totalSize += stats.size
    }
  }

  return totalSize
}
function formatBeijingTime(date: Date): string {
  const beijingOffset = 8 * 60 * 60 * 1000 // 北京时间偏移量（8小时）
  const adjustedTime = new Date(date.getTime() + beijingOffset)

  return adjustedTime.toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '')
    .replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})/, (_, y, m, d, t) => {
      return `${y}-${m}-${d} ${t}`
    })
}