import { Module, forwardRef } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ Wish ]),
    forwardRef(() => UsersModule) // если будет циклическая зависимость - 1й вариант решения
    // 2й вар (плохой) - передавать в providers UsersService (вместо передачи UsersModule в imports)
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService]
})
export class WishesModule {}
