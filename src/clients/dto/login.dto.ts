import { IsNotEmpty, IsString } from "class-validator";

export class ClientLoginDto {
  @IsNotEmpty()
  public username: string;

  public mobile: string;

  @IsString()
  public password: string;
  
}
