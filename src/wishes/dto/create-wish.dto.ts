import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl, Length, Min } from "class-validator";

export class CreateWishDto {
  @Length(1, 250)
  @IsNotEmpty()
  @ApiProperty({ example: 'Носки с корги', description: 'Название подарка' })
  name: string;
  
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com', description: 'Ссылка на подарок' })
  link: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com', description: 'Ссылка на изображение подарка' })
  image: string;

  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ example: 500, description: 'Стоимость подарка' })
  price: number;

  @Length(1, 1024)
  @IsNotEmpty()
  @ApiProperty({ example: 'Теплые и мягкие носки с ярким принтом', description: 'Описание подарка' })
  description: string;
}
