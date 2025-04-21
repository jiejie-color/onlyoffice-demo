<template>
  <div>
    <DynamicTable
      row-key="id"
      header-title="文件管理"
      :data-request="loadTableData"
      :columns="columns"
      bordered
      size="small"
    >
      <template #toolbar>
        <a-button type="primary" @click="openModal({})">
          <Icon icon="ant-design:plus-outlined" />
          新增
        </a-button>
      </template>
    </DynamicTable>
    <DraggableModal v-model:open="state.visible" fullscreen destroyOnClose :footer="null">
      <OnlyOffice :path="curRecord.path" :name="curRecord.name" :serverIP="serverIP" />
    </DraggableModal>
  </div>
</template>

<script lang="tsx" setup>
  import Api from '@/api';
  import { useTable } from '@/components/core/dynamic-table';
  import { useFormModal } from '@/hooks/useModal';
  import { baseColumns, type TableListItem, type TableColumnItem } from './columns.tsx';
  import JSZip from 'jszip';
  import { createPorjectSchemas } from './formSchemas.tsx';
  import { ref, reactive, onMounted } from 'vue';
  import OnlyOffice from '@/views/onlyoffice/index.vue';
  const [DynamicTable, dynamicTableInstance] = useTable({
    search: false,
  });
  const serverIP = ref('');
  onMounted(async () => {
    const res = await Api.fileList.fileListGetServerIp();
    serverIP.value = 'http://' + res;
  });
  const curRecord = ref<TableListItem>({
    /** 文件名 */
    name: '',
    /** 类型 */
    type: '',
    /** 路径 */
    path: '',
    /** id */
    id: 0,
    children: [],
    /** 上级路径 */
    parentPath: '',
    /** 文件大小 */
    size: 0,
    /** 最后修改时间 */
    mtime: '',
    /** description */
    ctime: '',
  });
  const state = reactive({
    visible: false,
  });
  const [showModal] = useFormModal();
  const loadTableData = async () => {
    const data = await Api.fileList.fileListList();
    return data;
  };
  const columns: TableColumnItem[] = [
    ...baseColumns,
    {
      title: '操作',
      width: 400,
      dataIndex: 'ACTION',
      fixed: 'right',
      actions: ({ record }) =>
        record.type === 'file'
          ? [
              {
                label: '编辑',
                onClick: () => {
                  state.visible = true;
                  curRecord.value = record;
                },
              },
            ]
          : [],
    },
  ];
  const openModal = async (record: Partial<TableListItem>) => {
    const [formRef] = await showModal({
      modalProps: {
        title: `${'新增'}工程`,
        width: 700,
        onFinish: async (values: any) => {
          const files = values.fileList.map((item) => item.originFileObj);
          const zip = new JSZip();
          await Promise.all(
            files.map(async (file: File) => {
              if (file.webkitRelativePath) {
                const zipPath = file.webkitRelativePath;
                const fileData = await file.arrayBuffer();
                zip.file(zipPath, fileData);
              }
            }),
          );
          // 生成ZIP文件
          const zipContent = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 5 },
          });
          const zipFileName = `${values.name}.zip`;
          await Api.fileList.fileListCreate({
            file: new File([zipContent], zipFileName),
          });
          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: createPorjectSchemas,
        autoSubmitOnEnter: true,
      },
    });
  };
</script>
