import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { OTP } from 'src/common/models/models';
import { UserModule } from 'src/user/user.module';
import { OtpService } from './otp.service';
import { OtpSchema } from './schema/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: OTP.name,
        useFactory: () => {
          return OtpSchema;
        },
      },
    ]),
    UserModule,
    PassportModule,
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
