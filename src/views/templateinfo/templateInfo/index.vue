<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="模版信息表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="revision"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'template.info.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增模版信息表')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'template.info.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'template.info.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'template.info.export'"
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
          v-auth="'template.info.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑模版信息表', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'template.info.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <TemplateInfoForm ref="templateInfoRef" />
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
  createTemplateInfoApi,
  removeTemplateInfoApi,
  updateTemplateInfoApi,
  getTemplateInfoListApi,
  getTemplateInfoDetailApi,
  importTemplateInfoExcelApi,
  exportTemplateInfoExcelApi,
} from '@/api/modules/templateinfo/templateInfo';
import { useHandleData } from '@/hooks/useHandleData';
import TemplateInfoForm from '@/views/templateinfo/templateInfo/components/TemplateInfoForm.vue';
import { useOptionsStore } from '@/stores/modules/options';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { ITemplateInfo } from '@/api/interface/templateinfo/templateInfo';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'TemplateInfoView'
})
const optionsStore = useOptionsStore();
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<ITemplateInfo.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'name', label: '模版名称' },
  { prop: 'belong', label: '所属银行' },
  { prop: 'system', label: '巡检系统' },
  { prop: 'userId', label: '巡检人员' },
  { prop: 'startDate', label: '巡检开始日期' },
  { prop: 'endDate', label: '巡检结束日期' },
  { prop: 'createdId', label: '创建人' },
  { prop: 'createdTime', label: '创建时间' },
  { prop: 'updatedId', label: '更新人' },
  { prop: 'updatedTime', label: '更新时间' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'name', label: '模版名称', el: 'input' },
  { prop: 'belong', label: '所属银行', el: 'input' },
  { prop: 'system', label: '巡检系统', el: 'input' },
  { prop: 'userId', label: '巡检人员', el: 'input' },
  { prop: 'startDate', label: '巡检开始日期', el: 'input' },
  { prop: 'endDate', label: '巡检结束日期', el: 'input' },
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
const getTableList = (params: ITemplateInfo.Query) => {
  let newParams = formatParams(params);
  return getTemplateInfoListApi(newParams);
};
const formatParams = (params: ITemplateInfo.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const templateInfoRef = ref<InstanceType<typeof TemplateInfoForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getTemplateInfoDetailApi({ id: row?.revision })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createTemplateInfoApi : updateTemplateInfoApi,
    getTableList: proTableRef.value?.getTableList
  }
  templateInfoRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: ITemplateInfo.Row) => {
  await useHandleData(
    removeTemplateInfoApi,
    { ids: [params.revision] },
    `删除【${params.revision}】模版信息表`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: string[]) => {
  await useHandleData(removeTemplateInfoApi, { ids }, '删除所选模版信息表')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '模版信息表',
    templateName: '模版信息表',
    tempApi: downloadTemplate,
    importApi: importTemplateInfoExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as ITemplateInfo.Query);
  useDownload(exportTemplateInfoExcelApi, "模版信息表", newParams);
};
</script>
