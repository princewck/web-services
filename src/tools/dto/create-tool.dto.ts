import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateToolDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public key: string;

  public description: string;

  public icon: string;

  @IsNumber()
  public categoryId: number;
}
