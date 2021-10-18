export interface IOrder extends Document {
  userId: string;
  city: string;
  date: Date;
  declaredValue: number;
  distance: number;
  distanceTotal: number;
  estimateTime: string;
  paymentType: string;
  phone: string;
  serviceValue: number;
  trackings: IOrderTrackingStep[];
}

export interface IOrderTrackingStep extends Document {
  inicio: string;
  llegada: string;
  entrega: string;
  evaluacion: number;
}
