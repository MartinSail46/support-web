import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { ITemplateIo } from '@/api/interface/templateio/templateIo'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
/**
* 查询列表
* @param params
* @returns {*}
*/
export const getTemplateIoListApi = (params: ITemplateIo.Query) => {
  return http.get<IPage<ITemplateIo.Row>>(ADMIN_MODULE + `/template-io`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createTemplateIoApi = (params: ITemplateIo.Form) => {
  return http.post(ADMIN_MODULE + `/template-io`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateTemplateIoApi = (params: ITemplateIo.Form) => {
  return http.put(ADMIN_MODULE + `/template-io`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeTemplateIoApi = (params: { ids: number[] }) => {
 return http.delete(ADMIN_MODULE + `/template-io`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getTemplateIoDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<ITemplateIo.Row>(ADMIN_MODULE + `/template-io/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importTemplateIoExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/template-io/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportTemplateIoExcelApi  = (params: ITemplateIo.Query) => {
  return http.download(ADMIN_MODULE + `/template-io/export`, params)
}
