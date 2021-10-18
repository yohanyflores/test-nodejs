import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class OrderDTO {
  @MaxLength(45)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    maxLength: 45,
  })
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({
    maxLength: 45,
    minLength: 3,
  })
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  readonly date: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    minimum: 0,
  })
  readonly declaredValue: number = 0;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    minimum: 1,
  })
  readonly distance: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    minimum: 1,
  })
  readonly distanceTotal: number;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  @Matches(/^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/, {
    message: 'debe cumplir el formato ISO 8601 de Duracion. ver: https://www.wikiwand.com/en/ISO_8601#Durations',
  })
  @ApiProperty({
    minLength: 3,
    maxLength: 50,
    type: 'string',
    description: 'debe cumplir el formato ISO 8601 de Duracion. ver: https://www.wikiwand.com/en/ISO_8601#Durations',
    pattern:
      '^(-?)P(?=\\d|T\\d)(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)([DW]))?(?:T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+(?:\\.\\d+)?)S)?)?$',
  })
  readonly estimateTime: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['TARJETA', 'EFECTIVO'])
  @ApiProperty({
    enum: ['TARJETA', 'EFECTIVO'],
  })
  readonly paymentType: string;

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
  })
  readonly phone: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    minimum: 0,
    default: 0,
  })
  readonly serviceValue: number = 0;
}
