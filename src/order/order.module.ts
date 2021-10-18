import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER, ORDER_TRACKING } from 'src/common/models/models';
import { OrderTrackingStepSchema } from './schema/order-tracking-step.schema';
import { OrderSchema } from './schema/order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ORDER.name,
        useFactory: () => {
          return OrderSchema;
        },
      },
      {
        name: ORDER_TRACKING.name,
        useFactory: () => {
          return OrderTrackingStepSchema;
        },
      },
    ]),
    UserModule,
    AuthModule,
    PassportModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
