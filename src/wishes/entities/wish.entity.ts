import { ApiProperty } from '@nestjs/swagger';
import { Length, Min } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { UserPublicResponseDto } from 'src/users/dto/user-public-profile-response.dto';
import { User } from 'src/users/entities/user.entity';
import { DateBaseEntity } from 'src/utils/base-entities/date-base.entity';
import roundToDecimal from 'src/utils/helpers/round-to-decimal';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wish extends DateBaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id: number;

  @Column()
  @Length(1, 250)
  @ApiProperty({ example: 'Носки с корги', description: 'Название подарка' })
  name: string;

  @Column()
  @ApiProperty({
    example: 'https://example.com',
    description: 'Ссылка на подарок',
  })
  link: string;

  @Column()
  @ApiProperty({
    example: 'https://example.com',
    description: 'Ссылка на изображение подарка',
  })
  image: string;

  // @Column({ type: 'decimal', scale: 2, default: 1 })
  @Column({ type: 'real', default: 1 })
  @Min(1)
  @ApiProperty({ example: 500, description: 'Стоимость подарка' })
  price: number;

  // @Column({ type: 'decimal', scale: 2, default: 0 })
  @Column({ type: 'real', default: 0 })
  @Min(1)
  @ApiProperty({ example: 100, description: 'Собранная сумма' })
  raised: number;

  @Column({ default: 0 })
  @ApiProperty({ example: 10, description: 'Счетчик копий подарка' })
  copied: number;

  @Column()
  @Length(1, 1024)
  @ApiProperty({
    example: 'Теплые и мягкие носки с ярким принтом',
    description: 'Описание подарка',
  })
  description: string;

  // 1 - описывает с какой сущностью связываем;
  // 2 - явно указываем с каким полем происходит связь (в user должно быть поле wishes)
  @ManyToOne(() => User, (user) => user.wishes)
  @ApiProperty({ type: UserPublicResponseDto })
  owner: User; // имя поля, которое должно быть в таблице wishes

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // для округления значений перед сохранением и обновлением
  @BeforeInsert()
  @BeforeUpdate() // todo - выяснить, почему не вызывается при обновлении значения
  roundValues() {
    roundToDecimal(this.price); // до сотых
    roundToDecimal(this.raised); // до сотых
  }
}
