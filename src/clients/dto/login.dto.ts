import { IsNotEmpty } from "class-validator";

export class ClientLoginDto {
  @IsNotEmpty()
  public username: string;

  public mobile: string;

  public password: string;
  
}
