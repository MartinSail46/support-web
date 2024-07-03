import type { IPageQuery } from '@/api/interface'

export namespace ITemplateIo {

  // 查询条件
  export interface Query extends IPageQuery {
    templateId?: string
    templateName?: string
    device?: string
    tps?: string
    kbReadS?: string
    kbWriteS?: string
    kbRead?: string
    kbWrite?: string
    revision?: number
    createdId?: string
    createdTime?: string
    updatedId?: string
    updatedTime?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    templateId?: string
    templateName?: string
    device?: string
    tps?: string
    kbReadS?: string
    kbWriteS?: string
    kbRead?: string
    kbWrite?: string
    revision?: number
    createdId?: string
    createdTime?: string
    updatedId?: string
    updatedTime?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    templateId?: string
    templateName?: string
    device?: string
    tps?: string
    kbReadS?: string
    kbWriteS?: string
    kbRead?: string
    kbWrite?: string
    revision?: number
    createdId?: string
    createdTime?: string
    updatedId?: string
    updatedTime?: string
  }

}