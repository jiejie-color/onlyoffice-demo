import { Button } from 'ant-design-vue';
import type { FormSchema } from '@/components/core/schema-form';

export const createPorjectSchemas: FormSchema<any>[] = [
  {
    field: 'fileList',
    component: 'Upload',
    componentSlots: {
      default: () => <Button>上传</Button>,
    },
    required: true,
    label: '上传文件夹',
    componentProps: ({ formModel }) => {
      return {
        multiple: true,
        directory: true,
        style: {
          maxHeight: '300px',
          overflow: 'auto',
        },
        beforeUpload: () => {
          return false; // 阻止默认上传
        },
        onChange: (info: any) => {
          if (info.fileList.length > 0) {
            formModel.name = info.fileList[0].originFileObj.webkitRelativePath.split('/')[0];
            formModel.fileList = info.fileList;
          }
        },
      };
    },
  },
  {
    field: 'name',
    label: '文件夹名',
    component: 'Input',
    required: true,
  },
];
