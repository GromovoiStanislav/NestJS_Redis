import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { RedisClientModule } from "@app/redis-client";


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    RedisClientModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ]
})
export class AuthModule {
}
