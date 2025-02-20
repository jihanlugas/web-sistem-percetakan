import { CompanyView } from "@/types/company";
import { OrderView } from "@/types/order";
import { Paging } from "./pagination";

export declare interface TransactionView {
  id: string;
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  type: string | number;
  amount: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  orderName: string;
  createName: string;
  updateName: string;

  company?: CompanyView;
  order?: OrderView;
}

export declare interface PageTransaction extends Paging {
  companyId?: string;
  orderId?: string;
  name?: string;
  description?: string;
  type?: string | number;
  companyName?: string;
  orderName?: string;
  createName?: string;
  preloads?: string;
  startAmount?: string | number;
  endAmount?: string | number;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreateTransaction {
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  type: string | number;
  amount: number | string;
}

export declare interface UpdateTransaction {
  orderId: string;
  name: string;
  description: string;
  type: string | number;
  amount: number | string;
}