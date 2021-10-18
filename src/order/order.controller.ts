import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { OrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Username } from 'src/common/decorators/username.decorator';
import { OrderTrackingDTO } from './dto/order-tracking.dto';

/**
 * Controlador de Orden.
 * Implementa un CRUD de Orden.
 */
@ApiBearerAuth('bearerAuth')
@Controller('api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  /**
   * Crea una nueva Orden.
   * @param orderDTO La data de la orden a crear.
   * @returns La nueva orden creada.
   */
  @ApiTags('Orders')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'La orden ha sido creada con exito.', type: OrderDTO })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiOperation({
    summary: 'Crea una nueva orden para el usuario autenticado.',
    description: 'Crea una nueva Orden..',
  })
  store(@Username() username: string, @Body() orderDTO: OrderDTO) {
    //TODO(yohany): Depende de la durabiidad del token, quizas tenga sentido verificar que el username aun exista.
    return this.orderService.store(username, orderDTO);
  }

  /**
   * Lee todas las ordenes del usuario.
   * @param username El username.
   * @returns Las ordenes del usuario.
   */
  @ApiTags('Orders')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'La lista de ordenes del usuario.',
    schema: { type: 'array', items: { $ref: getSchemaPath(OrderDTO) } },
  })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiOperation({
    summary: 'Obtiene todas las ordenes del usuario autenticado.',
    description: 'Obtener todas las ordenes.',
  })
  getAll(@Username() username: string) {
    return this.orderService.getAll(username);
  }

  /**
   * Lee una orden del usuario.
   * @param username El username.
   * @param id El id.
   * @returns La orden con el tracking especificado.
   */
  @ApiTags('Orders')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiOkResponse({ description: 'La orden ha sido obtenida con exito.', type: OrderDTO })
  @ApiOperation({
    summary: 'Lee una orden por su id que pertenesca al usuario autenticado.',
    description: 'Lee una orden por su id.',
  })
  find(@Username() username: string, @Param('id') id: string) {
    return this.orderService.find(username, id);
  }

  /**
   * Actualiza una Orden
   * @param username Actualiz una Orden.
   * @param id El id de la orden.
   * @param orderDTO La data de la orden modificada.
   * @returns La orden nueva modificada.
   */
  @ApiTags('Orders')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiBadRequestResponse({ description: 'La data presenta errores de validacion.' })
  @ApiOkResponse({ description: 'La orden ha sido modificada con exito.', type: OrderDTO })
  @ApiOperation({
    summary: 'Actualiza una orden identificada por su id, del usuario autenticado.',
    description: 'Actualiza una orden por su id.',
  })
  update(@Username() username: string, @Param('id') id: string, @Body() orderDTO: OrderDTO) {
    return this.orderService.update(username, id, orderDTO);
  }

  /**
   * Elimina una orden del usuario.
   * @param username Elimna una orden.
   * @param id EL id de la orden.
   * @returns La respuesta.
   */
  @ApiTags('Orders')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiNoContentResponse({ description: 'La orden ha sido eliminada con exito.' })
  @ApiOperation({
    summary: 'Elimina una orden identificada por su id, del usuario autenticado.',
    description: 'Elimina una orden por su id.',
  })
  destroy(@Username() username: string, @Param('id') id: string) {
    return this.orderService.destroy(username, id).then(() => {
      return;
    });
  }

  //#region Tracking

  /**
   * Crea una nueva Tracking para la orden.
   * @param orderDTO La data de la orden a crear.
   * @returns La nueva orden creada.
   */
  @ApiTags('Orders Tracking')
  @UseGuards(JwtAuthGuard)
  @Post(':id/tracking')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiBadRequestResponse({ description: 'La data presenta errores de validacion.' })
  @ApiOkResponse({ description: 'EL tracking ara la orden ha sido creado con exito.', type: OrderTrackingDTO })
  @ApiOperation({
    summary: 'Crea una tracking para la orden, del usuario autenticado.',
    description: 'Crea una tracking para la orden.',
  })
  storeTracking(@Username() username: string, @Param('id') id: string, @Body() trackingDTO: OrderTrackingDTO) {
    return this.orderService.storeTracking(username, id, trackingDTO);
  }

  /**
   * Lee todos los tracking de una orden.
   * @param username El usuario.
   * @param id EL id de la orden.
   * @returns Los trackings
   */
  @ApiTags('Orders Tracking')
  @UseGuards(JwtAuthGuard)
  @Get(':id/tracking')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiOkResponse({
    description: 'La lista de tracking de la orden.',
    schema: { type: 'array', items: { $ref: getSchemaPath(OrderTrackingDTO) } },
  })
  @ApiOperation({
    summary: 'Lee todos los tracking para la orden, del usuario autenticado.',
    description: 'Lee los tracking de la orden.',
  })
  getAllTracking(@Username() username: string, @Param('id') id: string) {
    return this.orderService.getAllTracking(username, id);
  }

  /**
   * Lee un tracking de una orden por su id.
   * @param username El username.
   * @param id El id.
   * @returns La orden con el tracking especificado.
   */
  @ApiTags('Orders Tracking')
  @UseGuards(JwtAuthGuard)
  @Get(':id/tracking/:tid')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @ApiParam({ name: 'tid', description: 'El id de del tracking', type: 'string' })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiNotFoundResponse({ description: 'Tracking Not Found' })
  @ApiOkResponse({ description: 'EL tracking ara la orden ha sido obtenido con exito.', type: OrderTrackingDTO })
  @ApiOperation({
    summary: 'Lee un tracking por su id de la orden, del usuario autenticado.',
    description: 'Lee un tracking por su id.',
  })
  findTracking(@Username() username: string, @Param('id') id: string, @Param('tid') tid: string) {
    return this.orderService.findTracking(username, id, tid);
  }

  /**
   * Actualiza un tracing de una orden.
   * @param username El username.
   * @param id EL id de la orden.
   * @param tid El tracking id.
   * @param trackingDTO Los datos a cambiar.
   * @returns EL nuevo tracking modificado.
   */
  @ApiTags('Orders Tracking')
  @UseGuards(JwtAuthGuard)
  @Put(':id/tracking/:tid')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @ApiParam({ name: 'tid', description: 'El id de del tracking', type: 'string' })
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiNotFoundResponse({ description: 'Tracking Not Found' })
  @ApiBadRequestResponse({ description: 'La data presenta errores de validacion.' })
  @ApiOkResponse({ description: 'EL tracking ara la orden ha sido actualizado con exito.', type: OrderTrackingDTO })
  @ApiOperation({
    summary: 'Actualiza un tracking por su id de una orden, del usuario autenticado.',
    description: 'Actualiza un tracking por su id.',
  })
  updateTracking(
    @Username() username: string,
    @Param('id') id: string,
    @Param('tid') tid: string,
    @Body() trackingDTO: OrderTrackingDTO,
  ) {
    return this.orderService.updateTracking(username, id, tid, trackingDTO);
  }

  /**
   * Elimina un tracking de una orden.
   * @param username El usuario.
   * @param id La orde id.
   * @param tid EL tracking id.
   * @returns Nada.
   */
  @ApiTags('Orders Tracking')
  @UseGuards(JwtAuthGuard)
  @Delete(':id/tracking/:tid')
  @ApiParam({ name: 'id', description: 'El id de la orden', type: 'string' })
  @ApiParam({ name: 'tid', description: 'El id de del tracking', type: 'string' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({ description: 'No tiene las credenciales.' })
  @ApiNotFoundResponse({ description: 'Order Not Found' })
  @ApiNotFoundResponse({ description: 'Tracking Not Found' })
  @ApiNoContentResponse({ description: 'El tracking de la orden ha sido elinado con exito.' })
  @ApiOperation({
    summary: 'Elimina un tracking por su id de una orden, del usuario autenticado.',
    description: 'Elimina un tracking por su id.',
  })
  destroyTracking(@Username() username: string, @Param('id') id: string, @Param('tid') tid: string) {
    return this.orderService.destroyTracking(username, id, tid).then(() => {
      return '';
    });
  }

  //#endregion
}
