import { IsString, IsJSON, IsNotEmpty } from "class-validator";

export class CreateGptTemplateDto {

  @IsString()
  public name: string;

  @IsJSON()
  public prompt: string;

  public createdAt = new Date();

}
