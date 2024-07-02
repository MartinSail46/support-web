import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { ITemplateInfo } from '@/api/interface/templateinfo/templateInfo'
import type { UploadRawFile } from 'element-plus/es/components/upload/src/upload'

/**
 * 查询列表
 * @param params
 * @returns {*}
 */
export const getTemplateInfoListApi = (params: ITemplateInfo.Query) => {
  return http.get<IPage<ITemplateInfo.Row>>(ADMIN_MODULE + `/template-info`, params)
}

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const createTemplateInfoApi = (params: ITemplateInfo.Form) => {
  return http.post(ADMIN_MODULE + `/template-info`, params)
}

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const updateTemplateInfoApi = (params: ITemplateInfo.Form) => {
  return http.put(ADMIN_MODULE + `/template-info`, params)
}

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const removeTemplateInfoApi = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/template-info`, params)
}

/**
 * 获取详情
 * @param params
 * @returns {*}
 */
export const getTemplateInfoDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<ITemplateInfo.Row>(ADMIN_MODULE + `/template-info/${id}`)
}

/**
 * 导入excel
 * @param params
 */
export const importTemplateInfoExcelApi = (params: UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/template-info/import`, params)
}

/**
 * 导出excel
 * @param params
 * @returns {*}
 */
export const exportTemplateInfoExcelApi = (params: ITemplateInfo.Query) => {
  return http.download(ADMIN_MODULE + `/template-info/export`, params)
}
