import { CompanyView } from "./company";
import { Paging } from "./pagination";

export declare interface UserView {
  id: string;
  companyId: string;
  usercompanyId: string;
  role: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  fullname: string;
  passVersion: number;
  isActive: boolean;
  photoId: string;
  photoUrl: string;
  lastLoginDt?: string;
  birthDt?: string;
  birthPlace: string;
  accountVerifiedDt?: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt?: string;
  createName: string;
  updateName: string;
  company?: CompanyView;
}

export declare interface PageUser extends Paging {
  companyId?: string;
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
  address?: string;
  birthPlace?: string;
  createName?: string;
  preloads?: string;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreateUser {
  companyId: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  username: string;
  passwd: string;
  address: string;
  birthDt?: string | DateConstructor;
  birthPlace: string;
}

export declare interface UpdateUser {
  fullname: string;
  email: string;
  phoneNumber: string;
  username: string;
  address: string;
  birthDt?: string | DateConstructor;
  birthPlace: string;
}

export declare interface ChangePassword {
  currentPasswd: string;
  passwd: string;
  confirmPasswd: string;
}