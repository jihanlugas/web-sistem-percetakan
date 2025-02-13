import { CompanyView } from "@/types/company";
import { OrderView } from "@/types/order";
import { Paging } from "./pagination";

export declare interface PaymentView {
  id: string;
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  amount: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  createName: string;
  updateName: string;

  company?: CompanyView;
  order?: OrderView;
}

export declare interface PagePayment extends Paging {
  companyId?: string;
  orderId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  orderName?: string;
  createName?: string;
  preloads?: string;
  startAmount?: string | number;
  endAmount?: string | number;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreatePayment {
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  amount: number | string;
}

export declare interface UpdatePayment {
  name: string;
  description: string;
  amount: number | string;
}