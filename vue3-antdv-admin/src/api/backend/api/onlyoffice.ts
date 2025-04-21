// @ts-ignore
/* eslint-disable */

/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 * */

import { request, type RequestOptions } from "@/utils/request";

/** 文档回调地址 对应 Onlyoffice 的 editorConfig.callbackUrl 字段 POST /api/onlyoffice/callback */
export async function onlyofficeCallback(options?: RequestOptions) {
  return request<Record<string, any>>("/api/onlyoffice/callback", {
    method: "POST",
    ...(options || {}),
  });
}
