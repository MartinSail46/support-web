import type { IPageQuery } from '@/api/interface'

export namespace ITemplateInfo {

  // 查询条件
  export interface Query extends IPageQuery {
    name?: string
    belong?: string
    system?: string
    userId?: string
    startDate?: string
    endDate?: string
    createdId?: string
    createdTime?: string
    updatedId?: string
    updatedTime?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    name?: string
    belong?: string
    system?: string
    userId?: string
    startDate?: string
    endDate?: string
    revision?: number
    createdId?: string
    createdTime?: string
    updatedId?: string
    updatedTime?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    name?: string
    belong?: string
    system?: string
    userId?: string
    startDate?: string
    endDate?: string
    revision?: number
    createdId?: string
    createdTime?: string
    updatedId?: string
    updatedTime?: string
  }

}
