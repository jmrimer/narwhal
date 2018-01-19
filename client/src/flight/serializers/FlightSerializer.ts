import { Serializer } from '../../utils/serializer';
import FlightModel from '../model/FlightModel';

export default class FlightSerializer implements Serializer<FlightModel> {
  serialize(item: FlightModel): {} {
    throw new Error('Not Implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): FlightModel {
    return new FlightModel(
      item.id,
      item.name
    );
  }
}