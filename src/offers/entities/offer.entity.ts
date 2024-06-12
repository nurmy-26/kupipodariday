import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { DateBaseEntity } from "src/utils/base-entities/date-base.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Offer extends DateBaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id: number;

  // todo - проверить совпадение выходных данных со Swagger
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  @ApiProperty({ example: 100, description: 'Сумма поддержки' })
  amount: number;

  @Column({ default: false })
  @ApiProperty({ example: false, description: 'Показывать ли информацию о скидывающемся в списке' })
  hidden: boolean;

  // todo - в Swagger не должен отображаться password
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  roundValues() {
    if (this.amount !== undefined) {
      this.amount = parseFloat(this.amount.toFixed(2));
    }
  }
}
