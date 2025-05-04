<template>
  <div style="display: flex; align-items: center; justify-content: center; width: 100%">
    <DocumentEditor
      id="docEditor"
      :documentServerUrl="documentServerUrl + ':8848'"
      :config="config"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, type Ref } from 'vue';
  import { DocumentEditor, type IConfig } from '@onlyoffice/document-editor-vue';

  defineOptions({
    name: 'onlyoffice',
  });
  const props = defineProps<{
    path: string;
    name: string;
    serverIP: string;
  }>();
  const content = ref<string>(''); // 新增文本内容存储
  defineExpose<{ content: Ref<string> }>({
    content,
  });
  const documentServerUrl = 'http://192.168.3.8';
  const key =
    btoa(encodeURIComponent(props.path))
      .replace(/\//g, '') // 防御性处理：防止URL路径分割
      .replace(/=+$/, '') + // 移除填充符避免特殊字符
    `__${Date.now()}`; // 保留时间戳保证唯一性

  const config = ref<IConfig>({
    // 编辑器宽度
    width: '100%',
    // 编辑器高度
    height: '800px',
    // 编辑器类型，支持 word（文档）、cell（表格）、slide（PPT）
    documentType: props.name.includes('xlsx') ? 'cell' : 'word',
    // 文档配置
    document: {
      // 文件类型
      fileType: props.name.includes('xlsx') ? 'xlsx' : 'docx',
      // 文档标识符
      key,
      url: documentServerUrl + ':7001' + props.path,
      // 文档标题
      title: props.name,
      // title: '1111.xlsx',
      permissions: {
        // 启用评论
        comment: false,
        // 启用下载
        download: true,
        // 启用编辑
        edit: true,
        // 启用导出
        print: true,
        // 启用预览
        review: true,
      },
    },
    editorConfig: {
      callbackUrl: documentServerUrl + ':7001/api/onlyoffice/callback',
      // 设置语言
      lang: 'zh-CN',
      user: {
        group: '技术部',
        id: 'wytxer',
        name: '程序员未央',
      },
      // // 模板列表
      // templates: [],
      customization: {
        // 强制保存
        forcesave: true,
        features: {
          // 关闭拼写检查
          spellcheck: false,
        },
      },
    },
  });
</script>
