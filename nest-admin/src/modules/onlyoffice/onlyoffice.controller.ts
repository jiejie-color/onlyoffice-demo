import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { Public } from '../auth/decorators/public.decorator'
import { OnlyofficeService } from './onlyoffice.service'

@ApiTags('Onlyoffice')
@ApiSecurityAuth()
@Controller('onlyoffice')
export class OnlyofficeController {
  constructor(private onlyofficeService: OnlyofficeService) {}

  @Public()
  @Post('callback')
  @ApiOperation({
    summary: '文档回调地址',
    description: '对应 Onlyoffice 的 editorConfig.callbackUrl 字段',
  })
  // 这里表示成功的 statusCode 状态不能返回 201，否则会报错「这份文件无法保存。请检查连接设置或联系您的管理员」，因为在 Onlyoffice 如果 statusCode 不等于 200 认为是失败
  @HttpCode(HttpStatus.OK)
  async callback(
    @Body() body: any,
    // @Body() body: any,
  ): Promise<any> {
    console.log(111)
    return await this.onlyofficeService.callback(body)
  }
}