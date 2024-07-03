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
      <el-form-item label="关联的模版ID" prop="templateId">
        <el-input
          v-model="paramsProps.row.templateId"
          placeholder="请填写关联的模版ID"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="设备" prop="device">
        <el-input
          v-model="paramsProps.row.device"
          placeholder="请填写设备"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="每秒事务处理量" prop="tps">
        <el-input
          v-model="paramsProps.row.tps"
          placeholder="请填写每秒事务处理量"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="每秒从设备读取的数据（KB）" prop="kbReadS">
        <el-input
          v-model="paramsProps.row.kbReadS"
          placeholder="请填写每秒从设备读取的数据（KB）"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="每秒从设备写入的数据（KB）" prop="kbWriteS">
        <el-input
          v-model="paramsProps.row.kbWriteS"
          placeholder="请填写每秒从设备写入的数据（KB）"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="读取的总数据量" prop="kbRead">
        <el-input
          v-model="paramsProps.row.kbRead"
          placeholder="请填写读取的总数据量"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="写入的总数据量" prop="kbWrite">
        <el-input
          v-model="paramsProps.row.kbWrite"
          placeholder="请填写写入的总数据量"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="乐观锁" prop="revision">
        <el-input-number
          v-model="paramsProps.row.revision" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="创建人" prop="createdId">
        <el-input
          v-model="paramsProps.row.createdId"
          placeholder="请填写创建人"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker clearable
          v-model="paramsProps.row.createdTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择创建时间">
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
        <el-date-picker clearable
          v-model="paramsProps.row.updatedTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择更新时间">
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
import { ref, reactive } from 'vue'
import { type ElForm, ElMessage } from 'element-plus'

defineOptions({
    name: 'TemplateIoForm'
})


const rules = reactive({
  templateId: [{ required: true, message: '请填写关联的模版ID' }],
  delFlag: [{ required: true, message: '请填写删除标识' }],
  revision: [{ required: true, message: '请填写乐观锁' }],
  createdTime: [{ required: true, message: '请填写创建时间' }],
})

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