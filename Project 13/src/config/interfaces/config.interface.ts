import { IJwt } from "./jwt.interface";


export interface IConfig {
  port: number;
  jwt: IJwt;
}