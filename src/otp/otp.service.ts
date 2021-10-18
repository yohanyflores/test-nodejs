import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOtp, IOTPSuccess } from 'src/common/interfaces/otp.interface';
import { OTP } from 'src/common/models/models';
import { randomInt } from 'crypto';
import * as twilio from 'twilio';

@Injectable()
export class OtpService {
  /**
   * Cliente para twillio.
   */
  private clientTwilio: twilio.Twilio;

  constructor(@InjectModel(OTP.name) private readonly otpModel: Model<IOtp>) {
    this.clientTwilio = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async create(username: string, phone: string): Promise<IOTPSuccess> {
    const newOtp = new this.otpModel({
      userId: username,
      code: this.generateCode(),
      expireAt: this.nowPlus60Seconds(),
    });
    const resultOtp = await newOtp.save();
    await this.sendtoChannel(phone, resultOtp);
    return <IOTPSuccess>{ success: true, message: `Un codigo ha sido enviado al telefono ${phone}` };
  }

  async validate(username: string, code: string): Promise<IOTPSuccess> {
    return await this.otpModel
      .findOneAndDelete(
        {
          userId: username,
          code: code,
          expireAt: { $gte: new Date() },
        },
        {},
      )
      .then((otp: IOtp) => {
        if (!otp) {
          return <IOTPSuccess>{ success: false, message: `Codigo invalido o ya caducó.` };
        }
        return <IOTPSuccess>{ success: true, message: `El codigo ha sido validado correctamente.` };
      });
  }

  /**
   * Retorna la fecha dentro de 1 minuto.
   * @returns dentro de 1 minuto.
   */
  nowPlus60Seconds(): Date {
    const second = 1000;
    const now: Date = new Date();
    return new Date(now.getTime() + 60 * second);
  }

  /**
   * Genera un codigo de 5 digitos.
   * @returns un codigo random.
   */
  generateCode(): string {
    const codInt: number = randomInt(10000, 99999);
    return `${codInt}`;
  }

  /**
   * Enviar un codigo otp a un canal sms.
   * @param phone El numero telefonico con codigo de pais.
   * @param otp El otp con el codigo.
   */
  async sendtoChannel(phone: string, otp: IOtp) {
    console.log(`[Walter] ${otp.code} es su código de verificación`);
    try {
      if (process.env.TWILIO_STATE === 'ON') {
        await this.clientTwilio.messages
          .create({
            body: `[Walter] ${otp.code} es su código de verificación`,
            from: process.env.TWILIO_PHONE_FROM,
            to: `+57${phone}`,
          })
          .then((message) => console.log(message));
      }
    } catch (err) {
      console.log(err);
    }
  }
}
