import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, isNotEmpty } from 'class-validator';
import { Coordinate } from './rfc7946.dto';

/**
 * Enumerado para los tipos de retorno.
 */
export enum Retorno {
  /**
   * None No se toma en cuenta el retorno.
   * O que el retorno esta colocado implicitamente en la ruta.
   * Como un Anillo o circuito.
   */
  NA = 0,
  /**
   * Se especifica un retorno Directo desde la ultima coordenada a la primera en linea recta.
   */
  DIRECTO,
  /**
   * Se especifica que se debe retornar por la misma ruta. La ruta por dos.
   */
  REVERSO,
}

/**
 * Las coordenadas en que formato.
 */
export enum CoordenateFormat {
  /**
   * El RFC indica que primero va la longitud. y luego la lattud.
   */
  RFC7946 = 0,
  /**
   * Gloogle map al copiar las coordenadas primero da la Latitud y luego la longitud.
   */
  GOOGLE,
}

/**
 * Solicitud para el calculo de distancia y valoracion del servicio.
 */
export class DistanceRequestDTO {
  /**
   * Indicar los puntos del recorrido en esta ruta.
   */
  @ApiProperty({
    title: 'Ruta',
    description: 'Lista de Coordenadas con los puntos del recorrido.',
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'number',
        maxItems: 2,
        minItems: 2,
      },
    },
    example: [
      [-75.61926018560465, 6.14602421083569],
      [-75.6178654369789, 6.146370893726194],
    ],
  })
  ruta: Coordinate[];
  /**
   * Indica informacion de Retorno.
   */
  @ApiProperty({
    title: 'Retorno',
    description:
      'Indica la informacion para el Retorno. NA: Es el valor por defect, indica que no aplica. Directo: Se calcula la distancia desde el ultimo punto al primero. Reverso: Se hace el recorrido nuevamente en direccion contraria.',
    enum: Retorno,
    enumName: 'Retorno',
    default: 'NA',
    required: true,
  })
  @IsEnum(Retorno)
  @IsIn(['NA', 'DIRECTO', 'REVERSO'])
  @IsNotEmpty()
  retorno = 'NA';

  /**
   * Indica el formato de las coordenadas.
   */
  @ApiProperty({
    title: 'Coordenadas Formato',
    description:
      'Indica el orden de las coordenadas, por defecto es [longitud, latitud], pero google maneja [latitud, longitud]',
    enum: CoordenateFormat,
    enumName: 'Coordenate Format',
  })
  @IsEnum(CoordenateFormat)
  @IsIn(['GOOGLE', 'RFC7946'])
  @IsNotEmpty()
  format = 'RFC7946';
}
