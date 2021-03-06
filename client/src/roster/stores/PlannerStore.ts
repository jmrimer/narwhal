import { action, computed, observable } from 'mobx';
import { TimeService } from '../../tracker/services/TimeService';
import { Moment } from 'moment';

export class PlannerStore {
  private timeService: TimeService;

  @observable private _plannerWeek: Moment[] = [];
  @observable private _sidePanelWeek: Moment[] = [];
  @observable private _plannerTimeSpan: Moment[] = [];

  constructor(timeService: TimeService) {
    this.timeService = timeService;
    this._plannerWeek = this.timeService.getCurrentWeek();
    this._sidePanelWeek = this.timeService.getCurrentWeek();
    this._plannerTimeSpan = this.timeService.getCurrentTimeSpan();
  }

  @computed
  get plannerWeek() {
    return this._plannerWeek;
  }

  @computed
  get plannerTimeSpan() {
    return this._plannerTimeSpan;
  }

  @action.bound
  incrementPlannerWeek() {
    this._plannerWeek = this.timeService.incrementWeekByDay(this.plannerWeek);
  }

  @action.bound
  incrementPlannerTimeSpan() {
    this._plannerTimeSpan = this.timeService.incrementTimeSpanByDay(this.plannerTimeSpan);
    this.setPlannerWeek(this._plannerTimeSpan);
  }

  @action.bound
  decrementPlannerTimeSpan() {
    this._plannerTimeSpan = this.timeService.decrementTimeSpanByDay(this.plannerTimeSpan);
    this.setPlannerWeek(this._plannerTimeSpan);
  }

  @action.bound
  setPlannerWeek(timeSpan: Moment[]) {
    timeSpan.slice(0, 7);
    timeSpan[6] = timeSpan[6].endOf('day');
    this._plannerWeek = timeSpan;
  }

  @action.bound
  decrementPlannerWeek() {
    this._plannerWeek = this.timeService.decrementWeekByDay(this.plannerWeek);
  }

  @action.bound
  setSidePanelWeek(week: Moment[]) {
    this._sidePanelWeek = week;
  }

  @computed
  get sidePanelWeek() {
    return this._sidePanelWeek;
  }

  @action.bound
  navigateToSidePanelWeek(date: Moment) {
    this._sidePanelWeek = this.timeService.navigateToWeek(date);
  }

  @action.bound
  navigateToPlannerWeek(date: Moment) {
    this._plannerWeek = this.timeService.navigateToWeek(date);
  }

  @action.bound
  navigateToPlannerTimeSpan(date: Moment) {
    this._plannerTimeSpan = this.timeService.navigateToTimeSpan(date);
    this.setPlannerWeek(this._plannerTimeSpan);
  }

  @action.bound
  incrementSidePanelWeek() {
    this._sidePanelWeek = this.timeService.incrementWeek(this._sidePanelWeek);
  }

  @action.bound
  decrementSidePanelWeek() {
    this._sidePanelWeek = this.timeService.decrementWeek(this._sidePanelWeek);
  }
}
