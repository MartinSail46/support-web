<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="文件系统使用情况(df -h)"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'template.disk.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增文件系统使用情况(df -h)')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'template.disk.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'template.disk.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'template.disk.export'"
          type="primary"
          :icon="Download"
          plain
          @click="downloadFile"
        >
          导出
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'template.disk.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑文件系统使用情况(df -h)', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'template.disk.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <TemplateDiskForm ref="templateDiskRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CirclePlus,
  Delete,
  EditPen,
  Upload,
  Download,
} from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import {
  createTemplateDiskApi,
  removeTemplateDiskApi,
  updateTemplateDiskApi,
  getTemplateDiskListApi,
  getTemplateDiskDetailApi,
  importTemplateDiskExcelApi,
  exportTemplateDiskExcelApi,
} from '@/api/modules/templatedisk/templateDisk';
import { useHandleData } from '@/hooks/useHandleData';
import TemplateDiskForm from '@/views/templatedisk/templateDisk/components/TemplateDiskForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { ITemplateDisk } from '@/api/interface/templatedisk/templateDisk';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'TemplateDiskView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<ITemplateDisk.Row>[] = [
  { type: 'selection', width: 80 },
  // { prop: 'templateId', label: '关联的模版ID' },
  { prop: 'templateName', label: '关联的模版名称' },
  { prop: 'fileSystem', label: '文件系统' },
  { prop: 'size', label: '大小' },
  { prop: 'used', label: '已用' },
  { prop: 'available', label: '可用' },
  { prop: 'usedPercentage', label: '已用（百分比）' },
  { prop: 'mountPoint', label: '挂载点' },
  // { prop: 'revision', label: '乐观锁' },
  // { prop: 'createdId', label: '创建人' },
  // { prop: 'createdTime', label: '创建时间' },
  // { prop: 'updatedId', label: '更新人' },
  // { prop: 'updatedTime', label: '更新时间' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'templateId', label: '关联的模版ID', el: 'input' },
  { prop: 'fileSystem', label: '文件系统', el: 'input' },
  { prop: 'size', label: '大小', el: 'input' },
  { prop: 'used', label: '已用', el: 'input' },
  { prop: 'available', label: '可用', el: 'input' },
  { prop: 'usedPercentage', label: '已用（百分比）', el: 'input' },
  // { prop: 'mountPoint', label: '挂载点', el: 'input' },
  { prop: 'revision', label: '乐观锁', el: 'input' },
  { prop: 'createdId', label: '创建人', el: 'input' },
  { prop: 'createdTime',
    label: '创建时间',
    el: 'date-picker',
    span: 2,
    props: {
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
  },
  { prop: 'updatedId', label: '更新人', el: 'input' },
  { prop: 'updatedTime',
    label: '更新时间',
    el: 'date-picker',
    span: 2,
    props: {
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
  },
]
// 获取table列表
const getTableList = (params: ITemplateDisk.Query) => {
  let newParams = formatParams(params);
  return getTemplateDiskListApi(newParams);
};
const formatParams = (params: ITemplateDisk.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const templateDiskRef = ref<InstanceType<typeof TemplateDiskForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getTemplateDiskDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createTemplateDiskApi : updateTemplateDiskApi,
    getTableList: proTableRef.value?.getTableList
  }
  templateDiskRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: ITemplateDisk.Row) => {
  await useHandleData(
    removeTemplateDiskApi,
    { ids: [params.id] },
    `删除【${params.id}】文件系统使用情况(df -h)`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: string[]) => {
  await useHandleData(removeTemplateDiskApi, { ids }, '删除所选文件系统使用情况(df -h)')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '文件系统使用情况(df -h)',
    templateName: '文件系统使用情况(df -h)',
    tempApi: downloadTemplate,
    importApi: importTemplateDiskExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as ITemplateDisk.Query);
  useDownload(exportTemplateDiskExcelApi, "文件系统使用情况(df -h)", newParams);
};
</script>