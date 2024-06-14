import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class CreateWishlistDto {
  @IsString()
  @Length(0, 250)
  @IsOptional()
  @ApiProperty({ example: 'Мой вишлист', description: 'Название вишлиста' })
  name?: string;
  
  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: 'http://example.com', description: 'Ссылка на изображение' })
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({ example: [1, 5, 12], description: 'Список идентификаторов подарков' })
  itemsId?: number[];
}