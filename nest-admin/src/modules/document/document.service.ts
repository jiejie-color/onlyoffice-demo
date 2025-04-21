import { ConfigService } from '@nestjs/config';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { OnlyofficeService } from '../onlyoffice/onlyoffice.service';
import { DocumentForceSaveDto, DocumentInfoDto } from './document.dto';
import { DocumentForceSave, DocumentInfo } from './document.entity';
import { getServerUtilIp } from '~/utils/serverIP.util';

@Injectable()
export class DocumentService {
  constructor(
    private readonly config: ConfigService,
    private onlyofficeService: OnlyofficeService,
  ) { }

  async forceSave(body: DocumentForceSaveDto): Promise<DocumentForceSave> {
    // 1、保存业务数据
    // 2、调用 Onlyoffice 的强制保存，实际业务中可能还有更多的业务操作，可根据实际情况删改
    const { id: userdata, key, useJwtEncrypt } = body;
    const data = await this.onlyofficeService.forceSave({
      key,
      // 将业务参数传给 Onlyoffice 服务，当回调里面存在多个请求时，标识符将有助于区分特定请求
      userdata,
      useJwtEncrypt,
    });
    // 保存成功
    if (data.error === 0) {
      return null;
    }
    throw new HttpException(data, HttpStatus.OK);
  }

  async documentInfo(query: DocumentInfoDto): Promise<DocumentInfo> {
    const editorConfig = this.onlyofficeService.editorDefaultConfig();
    // 添加文档
    const key = btoa(encodeURIComponent(query.path))
      .replace(/\//g, '') // 防御性处理：防止URL路径分割
      .replace(/=+$/, '') + // 移除填充符避免特殊字符
      `__${Date.now()}`
    editorConfig.document = {
      ...editorConfig.document,
      fileType: 'docx',
      key: key,
      // url: `${this.config.get('domain')}/static/${key}`,
      url: `http://${getServerUtilIp()}/fileList${query.path}`,
      title: '测试文档.xlsx',
    };
    // 添加用户信息
    editorConfig.editorConfig.user = {
      group: '技术部',
      id: 'wytxer',
      name: '程序员未央',
    };
    // 加密编辑器参数
    if (query.useJwtEncrypt === 'y') {
      this.onlyofficeService.signJwt(editorConfig);
    }
    return {
      id: 1,
      remarks: '业务字段',
      editorConfig,
    };
  }

  async excelInfo(query: DocumentInfoDto): Promise<DocumentInfo> {
    const editorConfig = this.onlyofficeService.editorDefaultConfig();
    // 添加文档

    const key = btoa(encodeURIComponent(query.path))
      .replace(/\//g, '') // 防御性处理：防止URL路径分割
      .replace(/=+$/, '') + // 移除填充符避免特殊字符
      `__${Date.now()}`
    editorConfig.document = {
      ...editorConfig.document,
      fileType: 'xlsx',
      key,
      // url: `${this.config.get('domain')}/static/${key}`,
      url: `http://${getServerUtilIp()}/fileList${query.path}`,
      title: '测试表格.xlsx',
    };
    // 修改文档宽度
    editorConfig.width = '100%';
    // 修改编辑器类型
    editorConfig.documentType = 'cell';
    // 添加用户信息
    editorConfig.editorConfig.user = {
      group: '技术部',
      id: 'wytxer',
      name: '程序员未央',
    };
    editorConfig.editorConfig.callbackUrl = `http://${getServerUtilIp()}:7001/api/onlyoffice/callback`
    // 加密编辑器参数
    if (query.useJwtEncrypt === 'y') {
      this.onlyofficeService.signJwt(editorConfig);
    }
    return {
      id: 1,
      remarks: '业务字段',
      editorConfig,
    };
  }
}
