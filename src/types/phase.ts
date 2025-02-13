import { Paging } from "@/types/pagination";

export declare interface PhaseView {
  id: string;
  companyId: string;
  name: string;
  description: string;
  order: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  createName: string;
  updateName: string;
}

export declare interface PagePhase extends Paging {
  companyId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  createName?: string;
  company?: string;
}