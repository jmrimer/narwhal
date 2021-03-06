import { Serializer } from '../../utils/serializer';
import { AirmanQualificationModel } from '../models/AirmanQualificationModel';
import * as moment from 'moment';
import { QualificationModel } from '../../skills/qualifications/models/QualificationModel';

export class AirmanQualificationSerializer implements Serializer<AirmanQualificationModel> {
  serialize(item: AirmanQualificationModel): {} {
    return JSON.stringify(item);
  }

  deserialize(item: any): AirmanQualificationModel {
    return new AirmanQualificationModel(
      item.airmanId,
      new QualificationModel(
        item.qualification.id,
        item.qualification.acronym,
        item.qualification.title
      ),
      moment(item.earnDate),
      moment(item.periodicDue),
      moment(item.currencyExpiration),
      moment(item.lastSat),
      item.id
    );
  }
}