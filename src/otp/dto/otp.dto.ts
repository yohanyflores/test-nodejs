import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class OTPCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/^3[0-9]{9}$/, {
    message: 'solo celulares colombianos',
  })
  @MaxLength(10)
  @MinLength(10)
  @ApiProperty({
    minLength: 10,
    maxLength: 10,
    pattern: '^3[0-9]{9}$',
    description: 'Solo telefonos colombianos.',
    example: '3003835248',
  })
  readonly phone: string;
}

export class OtpValidateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @ApiProperty({
    maxLength: 25,
    description: 'El codigo a verificar.',
  })
  readonly code: string;
}
