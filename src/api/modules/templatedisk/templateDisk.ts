import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { ITemplateDisk } from '@/api/interface/templatedisk/templateDisk'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
/**
* 查询列表
* @param params
* @returns {*}
*/
export const getTemplateDiskListApi = (params: ITemplateDisk.Query) => {
  return http.get<IPage<ITemplateDisk.Row>>(ADMIN_MODULE + `/template-disk`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createTemplateDiskApi = (params: ITemplateDisk.Form) => {
  return http.post(ADMIN_MODULE + `/template-disk`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateTemplateDiskApi = (params: ITemplateDisk.Form) => {
  return http.put(ADMIN_MODULE + `/template-disk`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeTemplateDiskApi = (params: { ids: number[] }) => {
 return http.delete(ADMIN_MODULE + `/template-disk`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getTemplateDiskDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<ITemplateDisk.Row>(ADMIN_MODULE + `/template-disk/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importTemplateDiskExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/template-disk/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportTemplateDiskExcelApi  = (params: ITemplateDisk.Query) => {
  return http.download(ADMIN_MODULE + `/template-disk/export`, params)
}
