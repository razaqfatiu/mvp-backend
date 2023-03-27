export interface IProductSearchParam {
  id?: string
}

export interface IProductModel {
  dataValues: any
  id: string
  amountAvailable: number
  productName: string
  cost: number
  sellerId: string
}

export interface IProductInput {
  [x: string]: any
  id?: string
  amountAvailable: number
  productName: string
  cost: number
  sellerId: string
}
