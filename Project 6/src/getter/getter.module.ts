import { Module } from '@nestjs/common';
import {ScheduleModule} from "@nestjs/schedule";
import {GetterService} from "./getter.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [GetterService],
})
export class GetterModule {}
