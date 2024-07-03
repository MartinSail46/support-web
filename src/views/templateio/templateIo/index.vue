<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="磁盘IO读写情况(iostat -d)"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'template.io.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增磁盘IO读写情况(iostat -d)')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'template.io.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'template.io.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'template.io.export'"
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
          v-auth="'template.io.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑磁盘IO读写情况(iostat -d)', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'template.io.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <TemplateIoForm ref="templateIoRef" />
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
  createTemplateIoApi,
  removeTemplateIoApi,
  updateTemplateIoApi,
  getTemplateIoListApi,
  getTemplateIoDetailApi,
  importTemplateIoExcelApi,
  exportTemplateIoExcelApi,
} from '@/api/modules/templateio/templateIo';
import { useHandleData } from '@/hooks/useHandleData';
import TemplateIoForm from '@/views/templateio/templateIo/components/TemplateIoForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { ITemplateIo } from '@/api/interface/templateio/templateIo';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'TemplateIoView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<ITemplateIo.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'templateId', label: '关联的模版ID' },
  { prop: 'device', label: '设备' },
  { prop: 'tps', label: '每秒事务处理量' },
  { prop: 'kbReadS', label: '每秒从设备读取的数据（KB）' },
  { prop: 'kbWriteS', label: '每秒从设备写入的数据（KB）' },
  { prop: 'kbRead', label: '读取的总数据量' },
  { prop: 'kbWrite', label: '写入的总数据量' },
  { prop: 'revision', label: '乐观锁' },
  { prop: 'createdId', label: '创建人' },
  { prop: 'createdTime', label: '创建时间' },
  { prop: 'updatedId', label: '更新人' },
  { prop: 'updatedTime', label: '更新时间' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'templateId', label: '关联的模版ID', el: 'input' },
  { prop: 'device', label: '设备', el: 'input' },
  { prop: 'tps', label: '每秒事务处理量', el: 'input' },
  { prop: 'kbReadS', label: '每秒从设备读取的数据（KB）', el: 'input' },
  { prop: 'kbWriteS', label: '每秒从设备写入的数据（KB）', el: 'input' },
  { prop: 'kbRead', label: '读取的总数据量', el: 'input' },
  { prop: 'kbWrite', label: '写入的总数据量', el: 'input' },
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
const getTableList = (params: ITemplateIo.Query) => {
  let newParams = formatParams(params);
  return getTemplateIoListApi(newParams);
};
const formatParams = (params: ITemplateIo.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const templateIoRef = ref<InstanceType<typeof TemplateIoForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getTemplateIoDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createTemplateIoApi : updateTemplateIoApi,
    getTableList: proTableRef.value?.getTableList
  }
  templateIoRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: ITemplateIo.Row) => {
  await useHandleData(
    removeTemplateIoApi,
    { ids: [params.id] },
    `删除【${params.id}】磁盘IO读写情况(iostat -d)`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: string[]) => {
  await useHandleData(removeTemplateIoApi, { ids }, '删除所选磁盘IO读写情况(iostat -d)')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '磁盘IO读写情况(iostat -d)',
    templateName: '磁盘IO读写情况(iostat -d)',
    tempApi: downloadTemplate,
    importApi: importTemplateIoExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as ITemplateIo.Query);
  useDownload(exportTemplateIoExcelApi, "磁盘IO读写情况(iostat -d)", newParams);
};
</script>