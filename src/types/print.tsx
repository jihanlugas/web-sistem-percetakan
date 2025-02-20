import { CompanyView } from "@/types/company";
import { OrderView } from "@/types/order";
import { PaperView } from "@/types/paper";
import { Paging } from "./pagination";

export declare interface PrintView {
  id: string;
  companyId: string;
  orderId: string;
  paperId: string;
  name: string;
  description: string;
  isDuplex: boolean;
  pageCount: number;
  qty: number;
  price: number;
  total: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  orderName: string;
  paperName: string;
  createName: string;
  updateName: string;
  company?: CompanyView;
  order?: OrderView;
  paper?: PaperView;
}

export declare interface PagePrint extends Paging {
  companyId?: string;
  orderId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  orderName?: string;
  paperName?: string;
  createName?: string;
  preloads?: string;
  startTotalPrint?: string | number;
  endTotalPrint?: string | number;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreatePrint {
  companyId: string;
  orderId: string;
  name: string;
  description: string;
  paperId: string;
  isDuplex: boolean;
  pageCount: number | string;
  qty: number | string;
  price: number | string;
  total: number | string;
}

export declare interface UpdatePrint {
  name: string;
  description: string;
  paperId: string;
  isDuplex: boolean;
  pageCount: number | string;
  qty: number | string;
  price: number | string;
  total: number | string;
}