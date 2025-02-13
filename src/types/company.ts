import { Paging } from "@/types/pagination";

export declare interface CompanyView {
  id: string;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  createName: string;
  updateName: string;
  totalGor: number;
  totalPlayer: number;
}


export declare interface CreateCompany {
  fullname: string;
  username: string;
  passwd: string;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export declare interface UpdateCompany {
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
}

export declare interface PageCompany extends Paging{
  name: string;
  description: string;
  createName: string;
}