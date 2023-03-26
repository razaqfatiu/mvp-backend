export interface IProductSearchParam {
  id?: string;
}

export interface IProductModel {
  id: string;
  amountAvailable: number;
  productName: string;
  cost: number;
  sellerId: string;
}

export interface IProductInput {
  id?: string;
  amountAvailable: number;
  productName: string;
  cost: number;
  sellerId: string;
}
