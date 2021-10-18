import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { OtpService } from 'src/otp/otp.service';
import { Username } from 'src/common/decorators/username.decorator';
import { OTPCreateDTO, OtpValidateDTO } from 'src/otp/dto/otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestBodyObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly otpService: OtpService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOkResponse({
    description: 'Se genero y envio con exito ',
    schema: {
      properties: {
        success: {
          type: 'boolean',
        },
        message: {
          type: 'string',
        },
      },
      example: { success: true, message: 'Un codigo ha sido enviado al telefono 3003835248.' },
    },
  })
  @ApiOperation({
    summary: 'Login.',
    description: 'Login.',
    requestBody: <RequestBodyObject>{
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                example: 'chavo',
              },
              password: {
                type: 'string',
                example: 'chavito',
              },
            },
          },
        },
      },
    },
  })
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Post('signup')
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }

  /**
   * sendOtp Crea y envia un OTP.
   * @param username El username.
   * @param otpDTO EL cuerpo de la solicitud.
   */
  @UseGuards(JwtAuthGuard)
  @Post('sendotp')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearerAuth')
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiOkResponse({
    description: 'Se genero y envio con exito ',
    schema: {
      properties: {
        success: {
          type: 'boolean',
        },
        message: {
          type: 'string',
        },
      },
      example: { success: true, message: 'Un codigo ha sido enviado al telefono 3003835248.' },
    },
  })
  @ApiOperation({
    summary: 'Valida un OTP generado previamente y que no ha expirado..',
    description: 'Valida un OTP.',
  })
  async sendOtp(@Username() username: string, @Body() otpDTO: OTPCreateDTO) {
    return await this.otpService.create(username, otpDTO.phone);
  }

  /**
   * Valida un OTP que ha sido enviaod previamente.
   * @param username El sername.
   * @param optValidateDTO EL cuerpo de la solicitud.
   * @returns { success: true | false, message : 'mensaje' }
   */
  @UseGuards(JwtAuthGuard)
  @Post('validateotp')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearerAuth')
  @ApiOkResponse({
    description: 'Se genero y envio con exito ',
    schema: {
      properties: {
        success: {
          type: 'boolean',
        },
        message: {
          type: 'string',
        },
      },
      example: { success: true, message: 'El codigo ha sido validado correctamente.' },
    },
  })
  @ApiOperation({
    summary: 'Genera y envia un OTP de 5 digitos, que expira en 1 minuto.',
    description: 'Genera y envia un OTP para el usuario autenticado.',
  })
  async validateOtp(@Username() username: string, @Body() optValidateDTO: OtpValidateDTO) {
    return await this.otpService.validate(username, optValidateDTO.code);
  }
}
