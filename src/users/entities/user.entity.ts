import { Contains, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {

  // @PrimaryGeneratedColumn()
  // id: number;

  // @Column()
  // @Length(2, 20) // валидируем длину имени
  // firstName: string;

  // @Column()
  // lastName: string;

  // @Column()
  // @Contains('hi') // поле должно содержать строку hi
  // about: string;

  // @Column()
  // isActive: boolean;
} 
