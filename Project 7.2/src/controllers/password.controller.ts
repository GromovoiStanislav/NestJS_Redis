import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ResetTokenInterface } from "../domain/reset.token.interface";
import { PasswordService } from "../services/password.service";
import { PasswordResetTokenRequestDTO } from "./dto/password-reset-token-request.dto";
import { PasswordUpdateRequestDTO } from "./dto/password-update-request.dto";

@Controller("password")
export class PasswordController {

  constructor(
    private readonly passwordResetService: PasswordService
  ) {
  }

  @Post("generate-token")
  async generateToken(@Body() passwordResetTokenRequestDTO: PasswordResetTokenRequestDTO): Promise<{ data: ResetTokenInterface }> {

    const data = await this.passwordResetService.generateResetToken(passwordResetTokenRequestDTO.userId);

    return { data };
  }

  @Post("update-password")
  async updatePassword(@Body() passwordUpdateRequestDTO: PasswordUpdateRequestDTO): Promise<string> {

    //Check if the token is valid
    const userId = await this.passwordResetService.getTokenUserId(passwordUpdateRequestDTO.token);

    if (!userId) {
      throw new BadRequestException("Invalid token");
    } else if (userId !== passwordUpdateRequestDTO.userId){
      throw new BadRequestException("Invalid userId");
    }

    //TODO Update the user password
    return "Password updated successfully"
  }
}