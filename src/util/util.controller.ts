import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DistanceRequestDTO } from './dto/distance.dto';
import { UtilService } from './util.service';

@ApiTags('Utils')
@Controller('api/v1/util')
export class UtilController {
  constructor(private readonly utilService: UtilService) {}

  @Post('geo/valoracion')
  @ApiOkResponse({ description: 'La orden ha sido creada con exito.', type: DistanceRequestDTO })
  @ApiOperation({
    summary: 'Valora un recorrido.',
    description: 'Dado un conjunto de coordenadas geograficas, valora el recorrido.',
  })
  @ApiBadRequestResponse({ description: 'Problemas con la solicitud.' })
  @ApiTags('Utils', 'Geo')
  @HttpCode(HttpStatus.OK)
  distance(@Body() distanceReq: DistanceRequestDTO) {
    return this.utilService.distance(distanceReq);
  }
}
