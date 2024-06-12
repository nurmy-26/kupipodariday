import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ Wish, User ]),
  ],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService]
})
export class OffersModule {}
