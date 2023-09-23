import { IsNotEmpty } from "class-validator";

export class CreateClientDto {
  @IsNotEmpty()
  public username: string;

  public nick: string;

  @IsNotEmpty()
  public mobile: string;

  public salt: string;

  @IsNotEmpty()
  public password: string;
  
}
