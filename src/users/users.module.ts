import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { OffersModule } from 'src/offers/offers.module';
import { WishlistsModule } from 'src/wishlists/wishlists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wish, Wishlist, Offer]),
    forwardRef(() => WishesModule),
    forwardRef(() => OffersModule),
    forwardRef(() => WishlistsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
