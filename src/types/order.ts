import { CompanyView } from "@/types/company";
import { CustomerView } from "@/types/customer";
import { Paging } from "@/types/pagination";
import { OrderphaseView } from "@/types/orderphase";
import { DesignView } from "@/types/design";
import { PrintView } from "@/types/print";
import { FinishingView } from "@/types/finishing";
import { OtherView } from "@/types/other";
import { TransactionView } from "./transaction";


export declare interface OrderView {
  id: string;
  companyId: string;
  customerId: string;
  name: string;
  description: string;
  isDone: boolean;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  orderphaseId: string;
  phaseId: string;
  orderphaseName: string;
  totalDesign: number;
  totalPrint: number;
  totalFinishing: number;
  totalOther: number;
  totalTransaction: number;
  totalOrder: number;
  outstanding: number;
  companyName: string;
  customerName: string;
  createName: string;
  updateName: string;
  company?: CompanyView;
  customer?: CustomerView;
  designs?: DesignView[];
  prints?: PrintView[];
  finishings?: FinishingView[];
  others?: OtherView[];
  orderphases?: OrderphaseView[];
  transactions?: TransactionView[]
}

export declare interface PageOrder extends Paging {
  companyId?: string;
  customerId?: string;
  phaseId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  customerName?: string;
  isDone?: boolean | string;
  createName?: string;
  preloads?: string;
  startTotalOrder?: string | number;
  endTotalOrder?: string | number;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreateOrder {
  companyId: string;
  customerId: string;
  orderphaseId: string;
  name: string;
  description: string;
  newCustomer: string;
  newCustomerPhone: string;
  designs: CreateOrderDesign[];
  prints: CreateOrderPrint[];
  finishings: CreateOrderFinishing[];
  others: CreateOrderOther[];
}

export declare interface CreateOrderDesign {
  name: string;
  description: string;
  qty: number | string;
  price: number | string;
  total: number | string;
}

export declare interface CreateOrderPrint {
  name: string;
  description: string;
  paperId: string;
  isDuplex: boolean;
  pageCount: number | string;
  qty: number | string;
  price: number | string;
  total: number | string;

}

export declare interface CreateOrderFinishing {
  name: string;
  description: string;
  qty: number | string;
  price: number | string;
  total: number | string;

}

export declare interface CreateOrderOther {
  name: string;
  description: string;
  qty: number | string;
  price: number | string;
  total: number | string;
}

export declare interface AddPhase {
  orderphaseId: string;
}

export declare interface AddTransaction {
  name: string;
  description: string;
  amount: number | string;
}

export declare interface UpdateOrder {
  customerId: string;
  name: string;
  description: string;
}

