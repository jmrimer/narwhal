import { AirmanQualificationModel } from '../models/AirmanQualificationModel';
import * as moment from 'moment';
import { QualificationModel } from '../../skills/qualifications/models/QualificationModel';

export class AirmanQualificationModelFactory {
  static build(id: number) {
    return new AirmanQualificationModel(
      1,
      new QualificationModel(id, `${id}`, `${id}`),
      moment().add(id, 'days'),
      moment().add(id, 'days'),
      moment(0).add(id, 'days'),
      moment(0).add(id, 'days'),
      1
    );
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}