import type { TableColumn } from '@/components/core/dynamic-table';
// import ExeSvg from '@/assets/icons/file-type-exe.svg'; // 假设存在这个图标组件
export type TableListItem = API.FileListInfo;
export type TableColumnItem = TableColumn<TableListItem>;

export const baseColumns: TableColumnItem[] = [
  {
    title: '文件名称',
    dataIndex: 'name',
  },
  {
    title: '创建时间',
    dataIndex: 'ctime',
  },
  {
    title: '修改时间',
    dataIndex: 'mtime',
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    customRender: ({ record }) => {
      return formatFileSize(record.size);
    },
  },
];

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, exponent);
  // 保留两位小数但去掉末尾的零
  return `${value.toFixed(2).replace(/\.0+$/, '')} ${units[exponent]}`;
};
