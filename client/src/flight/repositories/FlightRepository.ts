import { FlightModel } from '../model/FlightModel';

export interface FlightRepository {
  save(flight: FlightModel): Promise<FlightModel>;
  delete(flightId: number): Promise<void>;
}