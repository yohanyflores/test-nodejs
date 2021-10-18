import { Schema } from 'mongoose';

/**
 * OrderSchema Contiene informacion del Schema de Ordernes, Constrains, etc.
 */
export const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      maxlength: 45,
      required: true,
    },
    city: {
      type: String,
      maxlength: 50,
      minlength: 3,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // Valor monetario??
    declaredValue: {
      type: Schema.Types.Number,
      min: 0,
      default: 0,
      required: true,
    },
    distance: {
      type: Schema.Types.Number,
      min: 1,
      required: true,
    },
    distanceTotal: {
      type: Schema.Types.Number,
      min: 1,
      required: true,
    },
    // Podria ser un ISO 8601 Duration Format. https://www.wikiwand.com/en/ISO_8601#Durations
    estimateTime: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
      match: [
        /^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/,
        'debe cumplir el formato ISO 8601 de Duracion. ver: https://www.wikiwand.com/en/ISO_8601#Durations',
      ],
    },
    paymentType: {
      type: String,
      enum: ['EFECTIVO', 'TARJETA'],
      required: true,
    },
    // Por los momentos solo numeros colombianos, sin espacios.
    phone: {
      type: String,
      minlength: 10,
      maxlength: 10,
      match: /^3[0-9]{9}$/,
      required: true,
    },
    // Dinero??
    serviceValue: {
      type: Schema.Types.Number,
      default: 0,
      min: 0,
      required: true,
    },
  },
  { timestamps: true },
);

// Definimos como es la populacion de los trackngs.
OrderSchema.virtual('trackings', {
  ref: 'orders.trackings',
  localField: '_id',
  foreignField: 'orderId',
});

OrderSchema.index({ userId: 1, _id: 1 }, { unique: true });
OrderSchema.set('toObject', { virtuals: true });
OrderSchema.set('toJSON', { virtuals: true });
