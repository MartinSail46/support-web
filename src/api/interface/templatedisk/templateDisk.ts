import type { IPageQuery } from '@/api/interface'

export namespace ITemplateDisk {

  // 查询条件
  export interface Query extends IPageQuery {
    templateId?: string
    templateName?: string
    fileSystem?: string
    size?: string
    used?: string
    available?: string
    usedPercentage?: string
    mountPoint?: string
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
    fileSystem?: string
    size?: string
    used?: string
    available?: string
    usedPercentage?: string
    mountPoint?: string
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
    fileSystem?: string
    size?: string
    used?: string
    available?: string
    usedPercentage?: string
    mountPoint?: string
    revision?: number
    createdId?: string
    createdTime?: string
    updatedId?: string
    updatedTime?: string
  }

}