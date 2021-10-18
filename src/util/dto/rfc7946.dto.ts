// Modelamos algunas estructuras de RFC 7946
// @see  https://datatracker.ietf.org/doc/html/rfc7946

/**
 * Modela las coordenadas.
 */
export type Coordinate = [lon: number, lat: number];

/**
 * Modela un Point unico.
 */
export type Point = {
  type: 'Point';
  coordinates: Coordinate;
};

/**
 * Modela un LinString
 */
export type LineString = {
  type: 'LineString';
  coordinates: Coordinate[];
};
