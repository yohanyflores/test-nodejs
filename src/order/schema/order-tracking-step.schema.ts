import { Schema } from 'mongoose';

/**
 * Esquema para el tracking
 */
export const OrderTrackingStepSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    inicio: {
      maxlength: 100,
      type: String,
      required: true,
    },
    llegada: {
      maxlength: 100,
      type: String,
      required: true,
    },
    entrega: {
      maxlength: 100,
      type: String,
      required: true,
    },
    evaluacion: {
      type: Number,
      min: 1,
      max: 5,
      integer: true,
      required: true,
    },
  },
  {},
);

OrderTrackingStepSchema.index({ orderId: 1, _id: -1 }, { unique: false });
