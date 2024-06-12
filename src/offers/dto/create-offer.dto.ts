import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator"

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ example: 100, description: 'Сумма поддержки' })
  amount: number;
  
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false, description: 'Показывать ли информацию о скидывающемся в списке' })
  hidden?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Идентификатор подарка' })
  itemId: number;
}
