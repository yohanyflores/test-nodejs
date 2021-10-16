import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER } from 'src/common/models/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: USER.name,
        useFactory: () => {
          return UserSchema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
