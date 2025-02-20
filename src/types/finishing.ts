import { CompanyView } from "@/types/company";
import { OrderView } from "@/types/order";
import { Paging } from "./pagination";

export declare interface FinishingView {
  id: string;
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  qty: number;
  price: number;
  total: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  customerName: string;
  createName: string;
  updateName: string;
  company?: CompanyView;
  order?: OrderView;
}

export declare interface PageFinishing extends Paging {
  companyId?: string;
  orderId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  orderName?: string;
  createName?: string;
  preloads?: string;
  startTotalFinishing?: string | number;
  endTotalFinishing?: string | number;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
} 

export declare interface CreateFinishing {
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  qty: number | string;
  price: number | string;
  total: number | string;
}

export declare interface UpdateFinishing {
  name: string;
  description: string;
  qty: number | string;
  price: number | string;
  total: number | string;
}