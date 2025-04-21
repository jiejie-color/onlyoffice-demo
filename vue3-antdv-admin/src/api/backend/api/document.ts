// @ts-ignore
/* eslint-disable */

/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 * */

import { request, type RequestOptions } from "@/utils/request";

/** 获取文档信息 仅构造 Onlyoffice 文档编辑器显示和保存需要的必要信息 GET /api/document/documentInfo */
export async function documentDocumentInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DocumentDocumentInfoParams,
  options?: RequestOptions
) {
  return request<API.DocumentInfo>("/api/document/documentInfo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取表格信息 仅构造 Onlyoffice 表格编辑器显示和保存需要的必要信息 GET /api/document/excelInfo */
export async function documentExcelInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DocumentExcelInfoParams,
  options?: RequestOptions
) {
  return request<API.DocumentInfo>("/api/document/excelInfo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 强制保存文档 通过调用 Onlyoffice 提供的指令接口间接保存文件，最终文件的报错操作还是在 editorConfig.callbackUrl 所指定的接口里面完成的 POST /api/document/forceSave */
export async function documentForceSave(
  body: API.DocumentForceSaveDto,
  options?: RequestOptions
) {
  return request<Record<string, any>>("/api/document/forceSave", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
