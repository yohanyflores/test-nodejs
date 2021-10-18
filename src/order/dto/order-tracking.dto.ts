import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min, Max } from 'class-validator';

/**
 * OrderTrackingDTO.
 */
export class OrderTrackingDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    maxLength: 100,
  })
  readonly inicio: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    maxLength: 100,
  })
  readonly llegada: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    maxLength: 100,
  })
  readonly entrega: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsInt()
  @ApiProperty({
    minimum: 1,
    maximum: 5,
    type: 'integer',
  })
  readonly evaluacion: number;
}
