import { IsNotEmpty, IsString } from "class-validator";
import { AdminRole } from "../../models/admin.entity";

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  public salt: string;

  public role: AdminRole;
}