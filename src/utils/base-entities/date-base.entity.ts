import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// чтобы не дублировать одни и те же поля в каждой сущности
export class DateBaseEntity {
  @CreateDateColumn()
  @ApiProperty({
    example: '2024-06-11T15:39:02.268Z',
    description: 'Время создания',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2024-08-13T23:59:02.268Z',
    description: 'Время обновления',
  })
  updatedAt: Date;
}
