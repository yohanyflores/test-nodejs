export interface IOtp extends Document {
  userId: string;
  code: string;
  expireAt: Date;
}

/**
 * IOTPSuccess Una interfaz que indica que se creo o se verifico el OTP.
 */
export interface IOTPSuccess extends Document {
  success: boolean;
  message: string;
}
