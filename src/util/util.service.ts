import { Injectable } from '@nestjs/common';
import { CoordenateFormat, DistanceRequestDTO, Retorno } from './dto/distance.dto';
import { Coordinate, LineString, Point } from './dto/rfc7946.dto';
import { IDistanceResponse } from 'src/common/interfaces/distance-response.interface';

// Calculamos los radianes
const rad = (x: number) => (x * Math.PI) / 180;

// Calculamos el cuadrado de un numero.
const sqrt = (x: number) => Math.sqrt(x);

// Funciones trigonometricas
const sin = (x: number) => Math.sin(x);
const cos = (x: number) => Math.cos(x);
const atan2 = (y: number, x: number) => Math.atan2(y, x);

// El radio de la tierra en metros.
const earthRadius = 6371e3;

/**
 * Algunas utilidades para geo.
 * Tome los conceptos de esta pagina http://www.movable-type.co.uk/scripts/latlong.html
 * Para el modelado:  https://datatracker.ietf.org/doc/html/rfc7946
 */
@Injectable()
export class UtilService {
  distance(distanceReq: DistanceRequestDTO): IDistanceResponse {
    // El costo por metro de distancia.
    const costoPorMetro: number = 4000 / 1000;

    // Invertimos las coordenadas en caso de ser formato GOOGLE.
    switch (distanceReq.format) {
      case 'GOOGLE':
        for (let i = 0; i < distanceReq.ruta.length; i++) {
          const item = distanceReq.ruta[i];
          distanceReq.ruta[i] = <Coordinate>[item[1], item[0]];
        }
        break;
      default:
        break;
    }

    // Construimos el LineString.
    const ls: LineString = <LineString>{ coordinates: distanceReq.ruta };

    const distIda = this.lineStringDistance(ls);
    let distRetorno = 0;

    // Calculamos lel Retorno
    switch (distanceReq.retorno) {
      case 'DIRECTO':
        if (ls.coordinates.length > 1) {
          distRetorno = this.cordinateDistance(ls.coordinates[ls.coordinates.length - 1], ls.coordinates[0]);
        }
        break;
      case 'REVERSO':
        distRetorno = distIda;
        break;
      case 'NA':
      default:
        break;
    }

    // Retornamos.
    const valorDistancia = distIda * costoPorMetro;
    const valorRegreso = distRetorno * costoPorMetro;

    return <IDistanceResponse>{
      ida: distIda,
      valorIda: valorDistancia,
      regreso: distRetorno,
      valorRegreso: valorRegreso,
      total: distIda + distRetorno,
      valorTotal: valorDistancia + valorRegreso,
    };
  }
  /**
   * Calcula la distancia entre dos puntos en metros.
   * @param start La primera cordenada.
   * @param end La segunda cordenada.
   * @returns La distancia entre las dos puntos.
   */
  pointDistance(pt1: Point, pt2: Point) {
    return this.cordinateDistance(pt1.coordinates, pt2.coordinates);
  }

  /**
   * Distancia entre los puntos recorridos por un lineString.
   * @param ls El linestring con las coordenadas.
   * @returns La distancia del recorrido del LineString.
   */
  lineStringDistance(ls: LineString) {
    let dist = 0;

    let last: Coordinate = null;
    for (const cord of ls.coordinates) {
      if (last !== null) {
        dist += this.cordinateDistance(last, cord);
      }
      last = cord;
    }

    return dist;
  }

  /**
   * Calcula la distancia entre dos cordenadas en metros.
   * @param cord1 Primera coordenada.
   * @param cord2 Segunda Coordenada.
   * @returns La distancia entre los dos puntos.
   * @see http://www.movable-type.co.uk/scripts/latlong.html
   * @see https://datatracker.ietf.org/doc/html/rfc7946
   */
  cordinateDistance(cord1: Coordinate, cord2: Coordinate): number {
    const lon1 = cord1[0];
    const lat1 = cord1[1];

    const lon2 = cord2[0];
    const lat2 = cord2[1];

    const dlat = rad(lat2 - lat1);
    const dlon = rad(lon2 - lon1);

    const a = sin(dlat / 2) ** 2 + cos(rad(lat1)) * cos(rad(lat2)) * sin(dlon / 2) ** 2;
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    const d = earthRadius * c;

    return d;
  }
}
