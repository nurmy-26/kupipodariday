import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Length } from "class-validator";
import { Offer } from "src/offers/entities/offer.entity";
import { DateBaseEntity } from "src/utils/base-entities/date-base.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class User extends DateBaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id: number;

  @Column({ unique: true })
  @Length(1, 64)
  @ApiProperty({ example: 'Илон Маск', description: 'Имя пользователя' })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(0, 200)
  @ApiProperty({ example: 'Миллиардер, филантроп, гений', description:'Описание пользователя' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @ApiProperty({ example: 'https://i.pravatar.cc/300', description: 'Аватар пользователя' })
  avatar: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'elon1234@mail.ru', description: 'Почта пользователя' })
  email: string;

  @Exclude()
  @Column({ select: false })
  @ApiProperty({ example: '1234', description: 'Пароль пользователя' })
  password: string;

  // @CreateDateColumn()
  // @ApiProperty({ example: '2024-06-11T15:39:02.268Z', description: 'Время создания пользователя' })
  // createdAt: Date;

  // @UpdateDateColumn()
  // @ApiProperty({ example: '2024-08-13T23:59:02.268Z', description: 'Время обновления пользователя' })
  // updatedAt: Date;

  // todo - проверить совпадение выходных данных со Swagger
  @OneToMany(() => Wish, (wish) => wish.owner) // todo - исправить пустое
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  // todo - проверить совпадение выходных данных со Swagger
  @OneToMany(() => Offer, (offer) => offer.user) // todo - исправить пустое
  offers: Offer[];
} 
