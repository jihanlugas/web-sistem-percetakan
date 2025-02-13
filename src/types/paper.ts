import { Paging } from "@/types/pagination";
import { CompanyView } from "@/types/company";

export declare interface PaperView {
  id: string;
  companyId: string;
  name: string;
  description: string;
  defaultPrice: number;
  defaultPriceDuplex: number;
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

export declare interface PagePaper extends Paging {
  companyId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  createName?: string;
  company?: string;
  preloads?: string;
}

export declare interface CreatePaper {
  companyId: string;
  name: string;
  description: string;
  defaultPrice?: string | number;
  defaultPriceDuplex?: string | number;
}

export declare interface UpdatePaper {
  name: string;
  description: string;
  defaultPrice?: string | number;
  defaultPriceDuplex?: string | number;
}