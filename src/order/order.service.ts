import { Injectable, NotFoundException } from '@nestjs/common';
import { ORDER, ORDER_TRACKING } from 'src/common/models/models';
import { Model, Types } from 'mongoose';
import { IOrder, IOrderTrackingStep } from 'src/common/interfaces/order.interface';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDTO } from './dto/order.dto';
import { OrderTrackingDTO } from './dto/order-tracking.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(ORDER.name) private readonly orderModel: Model<IOrder>,
    @InjectModel(ORDER_TRACKING.name) private readonly orderTrackingModel: Model<IOrderTrackingStep>,
  ) {}

  //#region Orders

  /**
   * Create Order para e usuario con el userId especificado.
   * @param orderDTO Presentacion de la orden.
   */
  async store(username: string, orderDTO: OrderDTO): Promise<IOrder> {
    const newOrder = new this.orderModel({ ...orderDTO, ...{ userId: username } });
    return await newOrder.save();
  }

  /**
   *
   * @param username Obtiene todos las Ordenes del usuario.
   * @returns Promesa con la lista de Ordenes del usuario. Sin tracking.
   */
  async getAll(username: string): Promise<IOrder[]> {
    return this.orderModel.find({ userId: username }).populate('trackings');
  }

  /**
   * Obtiene una Orden del usuario.
   * @param username El username.
   * @param idEl id.
   * @returns La orden especificada por su id.
   */
  async find(username: string, id: string): Promise<IOrder> {
    const order: IOrder = await this.orderModel
      .findById({ userId: username, _id: new Types.ObjectId(id) })
      .populate('trackings');
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    return order;
  }

  /**
   * Actualiza una Orden
   * @param id El id de la orden.
   * @param ordenDTO
   */
  async update(username: string, id: string, orderDTO: OrderDTO): Promise<IOrder> {
    // TODO(yohany): Se implementa sin manejo de Versiones. Para conflictos de Escritura.
    const order: IOrder = await this.orderModel.findOneAndUpdate(
      { userId: username, _id: new Types.ObjectId(id) },
      { $set: { ...orderDTO, userId: username } },
      { new: true },
    );
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    return order;
  }

  /**
   * Elimina una Orden,
   * @param username EL usuario.
   * @param id El id de la orden.
   */
  async destroy(username: string, id: string): Promise<IOrder> {
    const order: IOrder = await this.orderModel.findOneAndRemove({ userId: username, _id: new Types.ObjectId(id) });
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    return order;
  }

  //#endregion

  //#region Tracking

  /**
   * Create Order para e usuario con el userId especificado.
   * @param orderDTO Presentacion de la orden.
   */
  async storeTracking(username: string, orderId: string, trackingDTO: OrderTrackingDTO): Promise<IOrderTrackingStep> {
    return await this.find(username, orderId).then(() => {
      const newTracking = new this.orderTrackingModel({ ...trackingDTO, ...{ orderId: new Types.ObjectId(orderId) } });
      return newTracking.save();
    });
  }

  /**
   * Obtiene todos los tracking de una orden.
   * @param username El usuario propietario de la orden.
   * @param orderId La orden Id.
   * @returns Lista de Tracking.
   */
  async getAllTracking(username: string, orderId: string): Promise<IOrderTrackingStep[]> {
    return await this.find(username, orderId).then(() => {
      return this.orderTrackingModel.find({ orderId: new Types.ObjectId(orderId) });
    });
  }

  /**
   * Obtiene un tracking de una orden, por su tracking id (tid).
   * @param username
   * @param orderId EL ordenId.
   * @param tid EL ticketid
   * @returns EL tracking Step
   */
  async findTracking(username: string, orderId: string, tid: string): Promise<IOrderTrackingStep> {
    return await this.find(username, orderId).then(() => {
      return this.orderTrackingModel
        .findById({
          _id: new Types.ObjectId(tid),
          orderId: new Types.ObjectId(orderId),
        })
        .then((tracking) => {
          if (!tracking) {
            throw new NotFoundException('Tracking Not Found');
          }
          return tracking;
        });
    });
  }

  /**
   *  Actualiza la inormacion de un tracking de una orden
   * @param username El username.
   * @param orderId EL ordenId.
   * @param tid El tracking id.
   * @param trackingDTO LA data a modificar.
   * @returns Los nuevos cambios.
   */
  async updateTracking(
    username: string,
    orderId: string,
    tid: string,
    trackingDTO: OrderTrackingDTO,
  ): Promise<IOrderTrackingStep> {
    // TODO(yohany): SE implementa sin manejo de Versiones. Para conflictos de Escritura.
    return await this.find(username, orderId).then(() => {
      return this.orderTrackingModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(tid),
            orderId: new Types.ObjectId(orderId),
          },
          { $set: { ...trackingDTO, orderId: new Types.ObjectId(orderId) } },
          { new: true },
        )
        .then((tracking) => {
          if (!tracking) {
            throw new NotFoundException('Tracking Not Found');
          }
          return tracking;
        });
    });
  }

  /**
   * Elimina un tracking de la orden.
   * @param username El username.
   * @param orderId El ordenId.
   * @param tid El trackingid
   * @returns EL elemento eliminado.
   */
  async destroyTracking(username: string, orderId: string, tid: string): Promise<IOrderTrackingStep> {
    // TODO(yohany): SE implementa sin manejo de Versiones. Para conflictos de Escritura.
    return await this.find(username, orderId).then(() => {
      return this.orderTrackingModel
        .findOneAndRemove({
          _id: new Types.ObjectId(tid),
          orderId: new Types.ObjectId(orderId),
        })
        .then((tracking) => {
          if (!tracking) {
            throw new NotFoundException('Tracking Not Found');
          }
          return tracking;
        });
    });
  }

  //#endregion
}
