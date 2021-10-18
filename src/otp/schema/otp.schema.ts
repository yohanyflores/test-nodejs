import { Schema } from 'mongoose';

/**
 * OrderSchema Contiene informacion del Schema de Ordernes, Constrains, etc.
 */
export const OtpSchema = new Schema(
  {
    userId: {
      type: String,
      maxlength: 45,
      required: true,
    },
    code: {
      type: String,
      maxlength: 5,
      minlength: 5,
      match: /^\d{5}$/,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

OtpSchema.index({ userId: 1, code: 1 }, { unique: true });
OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
