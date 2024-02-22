import { Module } from "@nestjs/common";
import { HttpclientService } from "./httpclient.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [HttpclientService],
  exports: [HttpclientService]
})
export class HttpclientModule {
}
