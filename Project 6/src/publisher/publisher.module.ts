import { Module } from '@nestjs/common';
import {PublisherService} from "./publish.service";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [PublisherService],
})
export class PublisherModule {}
