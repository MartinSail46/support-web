<template>
  <el-dialog
    v-model="visible"
    :title="`${paramsProps.title}`"
    :destroy-on-close="true"
    width="580px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <el-form-item label="模版名称" prop="name">
        <el-input v-model="paramsProps.row.name" placeholder="请填写模版名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属银行" prop="belong">
        <el-input
          v-model="paramsProps.row.belong"
          placeholder="请填写所属银行"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="巡检系统" prop="system">
        <el-input
          v-model="paramsProps.row.system"
          placeholder="请填写巡检系统"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="巡检人员" prop="userId">
        <el-input
          v-model="paramsProps.row.userId"
          placeholder="请填写巡检人员"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="巡检开始日期" prop="startDate">
        <el-date-picker
          clearable
          v-model="paramsProps.row.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择巡检开始日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="巡检结束日期" prop="endDate">
        <el-date-picker
          clearable
          v-model="paramsProps.row.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择巡检结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建人" prop="createdId">
        <el-input
          v-model="paramsProps.row.createdId"
          placeholder="请填写创建人"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker
          clearable
          v-model="paramsProps.row.createdTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择创建时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新人" prop="updatedId">
        <el-input
          v-model="paramsProps.row.updatedId"
          placeholder="请填写更新人"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedTime">
        <el-date-picker
          clearable
          v-model="paramsProps.row.updatedTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择更新时间"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { type ElForm, ElMessage } from 'element-plus'
import { getUserinfo } from '@/api/modules/system/user'
import { hasText } from '@/utils/is'

defineOptions({
  name: 'TemplateInfoForm'
})

const rules = reactive({})

const visible = ref(false)
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {},
  api: undefined,
  getTableList: undefined
})

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  paramsProps.value = params
  //回显默认参数
  getUserinfo().then((res) => {
    //创建人
    if (!hasText(params.row.createdId)) {
      paramsProps.value.row.createdId = res.data.id
    }
    //更新人
    paramsProps.value.row.updatedId = res.data.id
  })

  visible.value = true
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await paramsProps.value.api!(paramsProps.value.row)
      ElMessage.success({ message: `${paramsProps.value.title}成功！` })
      paramsProps.value.getTableList!()
      visible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  acceptParams
})
</script>

<style scoped lang="scss"></style>
