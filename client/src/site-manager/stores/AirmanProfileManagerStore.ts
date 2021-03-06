import { action, computed, observable } from 'mobx';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { SiteModel } from '../../site/models/SiteModel';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { FilterOption } from '../../widgets/inputs/FilterOptionModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';
import * as moment from 'moment';
import { FormErrors } from '../../widgets/inputs/FieldValidation';
import { RankModel } from '../../rank/models/RankModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';

export class AirmanProfileManagerStore extends NotificationStore {
  @observable _airman: AirmanModel = AirmanModel.empty();
  @observable _sites: SiteModel[] = [];
  @observable _schedules: ScheduleModel[] = [];
  @observable _ranks: RankModel[] = [];
  @observable _rankId: number;
  @observable _ripItems: AirmanRipItemModel[] = [];
  @observable _scheduleId: number;
  @observable _errors: FormErrors = {};
  @observable _didSaveAirman: boolean = false;
  @observable _pendingDeleteAirman: boolean = false;

  shiftOptions = [
    {value: ShiftType.Day, label: ShiftType.Day},
    {value: ShiftType.Night, label: ShiftType.Night},
    {value: ShiftType.Swing, label: ShiftType.Swing}
  ];

  constructor(private airmanRepository: AirmanRepository) {
    super();
  }

  hydrate(
    airman: AirmanModel,
    sites: SiteModel[],
    schedules: ScheduleModel[],
    ranks: RankModel[],
    ripItems?: AirmanRipItemModel[],
  ) {
    this._airman = airman;
    this._sites = sites;
    this._schedules = schedules;
    this._ranks = ranks;
    this._ripItems = ripItems ? ripItems : this._ripItems;
    this._scheduleId = airman.currentScheduleId ?
      airman.currentScheduleId :
      this._schedules.find(s => s.type === ScheduleType.NoSchedule)!.id;
    this._rankId = !airman.isEmpty ?
      airman.rank.id :
      this._ranks.find(r => r.abbreviation === 'No Rank')!.id;
    this._errors = {};
    this._didSaveAirman = false;
    this._pendingDeleteAirman = false;
  }

  @computed
  get airman() {
    return this._airman;
  }

  @computed
  get sites() {
    return this._sites;
  }

  @computed
  get ripItems() {
    return this._ripItems;
  }

  @computed
  get ranks() {
    return this._ranks;
  }

  @computed
  get rankId() {
    return this._rankId;
  }

  @computed
  get scheduleId() {
    return this._scheduleId;
  }

  @computed
  get errors() {
    return this._errors;
  }

  @action.bound
  setErrors(errors: FormErrors) {
    this._errors = errors;
  }

  @computed
  get pendingDeleteAirman() {
    return this._pendingDeleteAirman;
  }

  @action.bound
  setPendingDeleteAirman(pending: boolean) {
    this._pendingDeleteAirman = pending;
  }

  @computed
  get siteOptions(): FilterOption[] {
    const siteOptions = this._airman.siteId === -1 ?
      [{value: -1, label: 'No Site Selected'}] :
      [];
    return siteOptions.concat(this._sites.map(site => {
      return {value: site.id, label: site.fullName};
    }));
  }

  @action.bound
  getSelectedSiteOption(id: number) {
    return this.siteOptions.find(s => s.value === id);
  }

  @computed
  get squadronOptions(): FilterOption[] {
    const site = this._sites.find(s => s.id === this._airman.siteId);
    if (!site) {
      return [];
    }

    return site.squadrons.map(squadron => {
      return {value: squadron.id, label: squadron.name};
    });
  }

  @action.bound
  getSelectedSquadronOption(id: number) {
    return this.squadronOptions.find(s => s.value === id);
  }

  @computed
  get flightOptions(): FilterOption[] {
    const site = this.getSite(this._airman.siteId);
    if (!site) {
      return [];
    }

    const squadron = this.getSquadron(this._airman.squadronId);
    if (!squadron) {
      return [];
    }

    return squadron.flights.map(flight => {
      return {value: flight.id, label: flight.name};
    });
  }

  @action.bound
  getSelectedFlightOption(id: number) {
    return this.flightOptions.find(f => f.value === id);
  }

  @computed
  get scheduleOptions() {
    return this._schedules.map(schedule => {
      return {value: schedule.id, label: schedule.type};
    });
  }

  @action.bound
  getSelectedScheduleOption(id: number) {
    return this.scheduleOptions.find(s => s.value === id);
  }

  @computed
  get rankOptions() {
    return this._ranks.map(rank => {
      return {value: rank.id, label: rank.abbreviation};
    });
  }

  @action.bound
  getSelectedRankOption(id: number) {
    return this.rankOptions.find(i => i.value === id);
  }

  @action.bound
  getSelectedShiftOption(shift: ShiftType) {
    return this.shiftOptions.find(s => s.value === shift);
  }

  @computed
  get expiredItemCount(): number {
    return this._ripItems
      .filter(item => item.isAboutToExpire)
      .length;
  }

  @computed
  get assignedItemCount(): number {
    return this._ripItems
      .filter(item => item.expirationDate != null && item.expirationDate.isValid())
      .length;
  }

  @action.bound
  setDidSaveAirman(didSaveAirman: boolean) {
    this._didSaveAirman = didSaveAirman;
  }

  @computed
  get didSaveAirman() {
    return this._didSaveAirman;
  }

  @action.bound
  setState(key: keyof AirmanModel | 'scheduleId' | 'rankId', value: any) {
    switch (key) {
      case 'siteId':
        this.setSquadronAndFlight(Number(value));
        break;
      case 'squadronId':
        this.setFlight(Number(value));
        break;
      case 'scheduleId':
        this._scheduleId = Number(value);
        break;
      case 'rankId':
        this._rankId = Number(value);
        break;
      default:
        break;
    }

    this._airman[(key as any)] = value;
  }

  @action.bound
  async addAirman() {
    if (this._scheduleId) {
      this.addSchedule();
    }

    if (this._rankId) {
      this.addRank();
    }

    this._airman = await this.airmanRepository.saveAirman(this._airman);
  }

  private addSchedule() {
    const schedule = this._schedules.find(s => s.id === this._scheduleId);
    if (schedule) {
      this._airman.schedules.push(new AirmanScheduleModel(this._airman.id, schedule, moment()));
    }
  }

  private addRank() {
    const rank = this._ranks.find(r => r.id === this._rankId);
    if (rank) {
      this._airman.rank = rank;
    }
  }

  private setSquadronAndFlight(siteId: number) {
    const site = this.getSite(siteId);
    if (!site || (site && site.squadrons.length < 1)) {
      this._airman.squadronId = -1;
      this._airman.flightId = -1;
      return;
    }

    const squadron = site.squadrons[0];
    if (squadron.flights.length < 1) {
      this._airman.squadronId = squadron.id;
      this._airman.flightId = -1;
      return;
    }

    this._airman.squadronId = squadron.id;
    this._airman.flightId = squadron.flights[0].id;
  }

  private setFlight(squadronId: number) {
    const squadron = this.getSquadron(squadronId);
    if (!squadron || (squadron && squadron.flights.length < 1)) {
      this._airman.flightId = -1;
      return;
    }

    const flight = squadron.flights[0];
    this._airman.flightId = flight.id;
  }

  private getSite(id: number) {
    return this._sites.find(s => s.id === id);
  }

  private getSquadron(id: number) {
    const squadrons = this._sites.map(site => site.squadrons).reduce((acc, val) => acc.concat(val), []);
    return squadrons.find(s => s.id === id);
  }
}