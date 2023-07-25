import { IsNotEmpty, IsString } from "class-validator";

export class CreateToolCategoryDto {

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public key: string;

  @IsString()
  public description: string;

  @IsString()
  public categoryId: number;

  public icon: string;

}
