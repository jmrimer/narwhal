import { Moment } from 'moment';
import QualificationModel from '../../skills/models/QualificationModel';
import { SkillType } from '../../skills/models/SkillType';
import * as moment from 'moment';

export default class AirmanQualificationModel {
  constructor(public airmanId: number,
              public qualification: QualificationModel,
              public earnDate: Moment,
              public expirationDate: Moment,
              public id?: number) {
  }

  get type() {
    return SkillType.Qualification;
  }

  get acronym() {
    return this.qualification.acronym;
  }

  get title() {
    return `${this.qualification.acronym} - ${this.qualification.title}`;
  }

  get skillId() {
    return this.qualification.id;
  }

  get isExpired() {
    return this.expirationDate.isBefore(moment.utc().add(14, 'days'));
  }
}