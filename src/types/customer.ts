import { CompanyView } from "./company";
import { Paging } from "./pagination";

export declare interface CustomerView {
  id: string;
  companyId: string;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  createName: string;
  updateName: string;
  company?: CompanyView;
}

export declare interface PageCustomer extends Paging {
  companyId?: string;
  name?: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  createName?: string;
  preloads?: string;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreateCustomer {
  companyId: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export declare interface UpdateCustomer {
  companyId: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phoneNumber: string;
}