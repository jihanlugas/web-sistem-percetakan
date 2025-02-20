import { CompanyView } from "@/types/company";
import { OrderView } from "@/types/order";
import { Paging } from "./pagination";

export declare interface DesignView {
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

export declare interface PageDesign extends Paging {
  companyId?: string;
  orderId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  orderName?: string;
  createName?: string;
  preloads?: string;
  startTotalDesign?: string | number;
  endTotalDesign?: string | number;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreateDesign {
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  qty: number | string;
  price: number | string;
  total: number | string;
}

export declare interface UpdateDesign {
  name: string;
  description: string;
  qty: number | string;
  price: number | string;
  total: number | string;
}