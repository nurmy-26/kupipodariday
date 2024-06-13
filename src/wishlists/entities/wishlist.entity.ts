import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { UserPublicResponseDto } from "src/users/dto/user-public-profile-response.dto";
import { User } from "src/users/entities/user.entity";
import { DateBaseEntity } from "src/utils/base-entities/date-base.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wishlist extends DateBaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id: number;

  @Column()
  @Length(0, 250)
  @ApiProperty({ example: 'Мой вишлист', description: 'Название вишлиста' })
  name: string;

  @Column()
  @ApiProperty({ example: 'https://example.com', description: 'Ссылка на изображение' })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  @ApiProperty({ type: UserPublicResponseDto })
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}