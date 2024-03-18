import { IAccessId } from "./access-id.interface";

export interface IAccessToken {
  token: string;
}

export interface IAccessIdResponse extends IAccessId {
  iat: number;
  exp: number;
}