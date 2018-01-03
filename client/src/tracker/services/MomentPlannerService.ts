import PlannerService from './PlannerService';
import * as moment from 'moment';
import { Moment } from 'moment';

export class MomentPlannerService implements PlannerService {
  getCurrentWeek(): Moment[] {
    const sunday = moment().startOf('week');
    return [
      sunday,
      sunday.clone().add(1, 'day'),
      sunday.clone().add(2, 'day'),
      sunday.clone().add(3, 'day'),
      sunday.clone().add(4, 'day'),
      sunday.clone().add(5, 'day'),
      sunday.clone().add(6, 'day')
    ];
  }
}