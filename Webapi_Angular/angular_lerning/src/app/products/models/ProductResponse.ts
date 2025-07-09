import { Product } from "./Product";

export interface ProductResponse {
  status: boolean;
  message: string;
  products: Product[];
  totalCount: number
}