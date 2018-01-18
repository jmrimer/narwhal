import AirmanModel from '../models/AirmanModel';
import { Serializer } from '../../utils/serializer';
import { QualificationSerializer } from './QualificationSerializer';
import { CertificationSerializer } from './CertificationSerializer';
import EventSerializer from '../../event/EventSerializer';

export class AirmanSerializer implements Serializer<AirmanModel> {
  private qualSerializer = new QualificationSerializer();
  private certSerializer = new CertificationSerializer();
  private eventSerializer = new EventSerializer();

  serialize(item: AirmanModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): AirmanModel {
    return new AirmanModel(
      item.id,
      item.flightId,
      item.firstName,
      item.lastName,
      item.qualifications.map((qual: object) => this.qualSerializer.deserialize(qual)),
      item.certifications.map((cert: object) => this.certSerializer.deserialize(cert)),
      item.events.map((event: object) => this.eventSerializer.deserialize((event))),
    );
  }
}