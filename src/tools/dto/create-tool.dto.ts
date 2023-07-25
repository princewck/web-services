import { IsNotEmpty, IsString } from "class-validator";

export class CreateToolDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public key: string;

  @IsString()
  public description: string;

  public icon: string;
}
