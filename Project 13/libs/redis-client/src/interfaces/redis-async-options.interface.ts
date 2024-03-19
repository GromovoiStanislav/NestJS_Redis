import { ModuleMetadata, Type } from "@nestjs/common";
import { IRedisOptions } from "./redis-options.interface";

export interface IRedisOptionsFactory {
  createRedisOptions(): Promise<IRedisOptions> | IRedisOptions;
}

export interface IRedisAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (...args: any[]) => Promise<IRedisOptions> | IRedisOptions;
  useClass?: Type<IRedisOptionsFactory>;
  inject?: any[];
}