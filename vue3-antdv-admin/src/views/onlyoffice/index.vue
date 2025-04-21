<template>
  <div style="display: flex; align-items: center; justify-content: center; width: 100%">
    <DocumentEditor
      id="docEditor"
      :documentServerUrl="documentServerUrl"
      :config="config"
      v-if="is"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, type Ref } from 'vue';
  import { DocumentEditor, type IConfig } from '@onlyoffice/document-editor-vue';
  import Api from '@/api';

  defineOptions({
    name: 'onlyoffice',
  });
  const is = ref<boolean>(false);
  const props = defineProps<{
    path: string;
    name: string;
    type: string;
    serverIP: string;
  }>();
  const content = ref<string>(''); // 新增文本内容存储
  defineExpose<{ content: Ref<string> }>({
    content,
  });
  onMounted(async () => {
    const res = await Api.document.documentExcelInfo({ path: props.path, useJwtEncrypt: 'n' });
    config.value = res.editorConfig;
    console.log(config.value);

    is.value = true;
  });
  const documentServerUrl = 'http://192.168.3.8' + ':80';
  // const key =
  //   btoa(encodeURIComponent(props.path))
  //     .replace(/\//g, '') // 防御性处理：防止URL路径分割
  //     .replace(/=+$/, '') + // 移除填充符避免特殊字符
  //   `__${Date.now()}`; // 保留时间戳保证唯一性

  const config = ref<IConfig>({});
</script>
