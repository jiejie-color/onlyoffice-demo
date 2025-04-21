// @ts-ignore
/* eslint-disable */

/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 * */

import { request, type RequestOptions } from "@/utils/request";

/** 获取文件列表 GET /api/fileList */
export async function fileListList(options?: RequestOptions) {
  return request<API.FileListInfo[]>("/api/fileList", {
    method: "GET",
    ...(options || {}),
  });
}

/** 新增文件 POST /api/fileList */
export async function fileListCreate(
  body: API.FileUploadDto,
  file?: File,
  options?: RequestOptions
) {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === "object" && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ""));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<boolean>("/api/fileList", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || { successMsg: "创建成功" }),
  });
}

/** 获取服务端IP GET /api/fileList/server-ip */
export async function fileListGetServerIp(options?: RequestOptions) {
  return request<string>("/api/fileList/server-ip", {
    method: "GET",
    ...(options || {}),
  });
}
