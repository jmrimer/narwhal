import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FlightRepository } from '../../flight/repositories/FlightRepository';
import { FlightModel } from '../../flight/model/FlightModel';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { Repositories } from '../../utils/Repositories';
import { Selectable } from '../models/Selectable';
import { RankModel } from '../../rank/models/RankModel';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';

export class SiteManagerStore extends NotificationStore {
  private flightRepository: FlightRepository;
  private siteRepository: SiteRepository;
  @observable private _profile: ProfileModel | null = null;
  @observable private _squadron: SquadronModel;
  @observable private _airmen: Selectable<AirmanModel>[] = [];
  @observable private _certifications: CertificationModel[] = [];
  @observable private _schedules: ScheduleModel[] = [];
  @observable private _shouldShowShiftPrompt: boolean = false;
  @observable private _shouldShowSchedulePrompt: boolean = false;
  @observable private _shouldShowAddFlightPrompt: boolean = false;
  @observable private _pendingFlightId: number | null = null;
  @observable private _pendingScheduleId: number | null = null;
  @observable private _selectedScheduleId: number | null = null;
  @observable private _pendingShift: ShiftType | null = null;
  @observable private _selectedShift: ShiftType | null = null;
  @observable private _pendingScheduleStartDate: any = moment(moment.now());
  @observable private _pendingNewFlight: FlightModel | null = null;
  @observable private _pendingOperatorFlightId: number | null = null;
  @observable private _flightsExpanded: number[] = [];

  constructor(repositories: Repositories) {
    super();
    this.flightRepository = repositories.flightRepository;
    this.siteRepository = repositories.siteRepository;
  }

  @action.bound
  hydrate(profile: ProfileModel,
          squadron: SquadronModel,
          airmen: AirmanModel[],
          certifications: CertificationModel[],
          schedules: ScheduleModel[]
  ) {
    this._profile = profile;
    this._squadron = squadron;
    this._airmen = Selectable.transform(
      airmen.filter(a => a.squadronId === squadron.id)
    );
    this._certifications = certifications;
    this._schedules = schedules;
  }

  @computed
  get expandedFlights () {
    return this._flightsExpanded;
  }

  @computed
  get currentPendingFlight () {
    return this._squadron.flights.find(f => f.id === this.pendingFlightId);
  }

  @computed
  get currentPendingFlightName () {
    return this.currentPendingFlight!.name;
  }

  @observable
  shouldExpandFlight(flightId: number) {
    return this._flightsExpanded.find(x => x === flightId) !== undefined;
  }

  @observable
  shouldAllowFlightDelete(flightId: number) {
    return this.getAirmenByFlightId(flightId).length === 0;
  }

  @action.bound
  addFlightToExpandedFlights(flightId: number) {
    if (!this.shouldExpandFlight(flightId)) {
      this._flightsExpanded.push(flightId);
    }
  }

  @action.bound
  removeFlightFromExpandedFlights(flightId: number) {
      this._flightsExpanded = this._flightsExpanded.filter(x => x !== flightId);
  }

  @computed
  get shouldShowSchedulePrompt() {
    return this._shouldShowSchedulePrompt;
  }

  @computed
  get shouldShowShiftPrompt() {
    return this._shouldShowShiftPrompt;
  }

  @computed
  get shouldShowAddFlightPrompt() {
    return this._shouldShowAddFlightPrompt;
  }

  @computed
  get siteName() {
    if (this._profile) {
      return this._profile!.siteName;
    }
    return '';
  }

  @computed
  get squadron() {
    return this._squadron;
  }

  @computed
  get certifications() {
    return this._certifications;
  }

  @computed
  get schedules() {
    return this._schedules;
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @computed
  get pendingFlightId() {
    return this._pendingFlightId;
  }

  @computed
  get pendingScheduleId() {
    return this._pendingScheduleId;
  }

  @computed
  get selectedScheduleId() {
    return this._selectedScheduleId;
  }

  @computed
  get pendingShift() {
    return this._pendingShift;
  }

  @computed
  get pendingScheduleStartDate() {
    return this._pendingScheduleStartDate;
  }

  @computed
  get pendingNewFlight() {
    return this._pendingNewFlight;
  }

  @computed
  get scheduleOptions() {
    return this._schedules.map(schedule => {
      return {value: schedule.id, label: schedule.type};
    });
  }

  @action.bound
  getScheduleOption(id: number | null) {
    if (id !== null) {
      return this.scheduleOptions.find(s => s.value === id);
    }
    return null;
  }

  @computed
  get selectedShift() {
    return this._selectedShift;
  }

  @computed
  get shiftPopupMessage() {
    return `Set a ${this.pendingShift}s shift for ${this.currentPendingFlightName}.`;
  }

  @computed
  get pendingOperatorFlightId() {
    return this._pendingOperatorFlightId;
  }

  getAirmenByFlightId = (flightId: number) => {
    return this._airmen.filter(a => a.model.flightId === flightId);
  }

  getShiftByFlightId = (flightId: number) => {
    if (this._pendingShift !== null && this.pendingFlightId === flightId) {
      return this.pendingShift;
    }
    const object = this.getAirmenByFlightId(flightId).reduce(
      (prev: any, curr: Selectable<AirmanModel>) => {
        if (!curr.model.shift) {
          return prev;
        }

        const type = curr.model.shift;
        prev[type] = prev[type] ? prev[type] += 1 : 1;
        return prev;
      },
      {}
    );
    if (Object.keys(object).length === 0) {
      return ShiftType.Day;
    }

    return Object.keys(object).reduce((a, b) => object[a] > object[b] ? a : b) as ShiftType;
  }

  getScheduleIdByFlightId = (flightId: number) => {
    const object = this.getAirmenByFlightId(flightId).reduce(
      (prev: any, curr: Selectable<AirmanModel>) => {
        if (!curr.model.currentAirmanSchedule) {
          return prev;
        }

        const type = curr.model.currentAirmanSchedule.schedule.id;
        prev[type] = prev[type] ? prev[type] + 1 : 1;
        return prev;
      },
      {}
    );

    if (Object.keys(object).length === 0) {
      return null;
    }

    return Object.keys(object).reduce((a, b) => object[a] > object[b] ? a : b);
  }

  getScheduleByScheduleId = (scheduleId: number) => {
    return this._schedules.find(schedule => schedule.id === scheduleId);
  }

  @action.bound
  hideSchedulePrompt() {
    this._shouldShowSchedulePrompt = false;
    this._pendingFlightId = null;
    this._pendingScheduleId = null;
    this._pendingScheduleStartDate = moment(moment.now());
  }

  @action.bound
  hideShiftPrompt() {
    this._shouldShowShiftPrompt = false;
    this._pendingFlightId = null;
    this._pendingShift = null;
  }

  @action.bound
  hideAddFlightPrompt() {
    this._shouldShowAddFlightPrompt = false;
  }

  @action.bound
  setAirmenShiftByFlightId(flightId: number, shift: ShiftType, airmenIds: number[]) {
    this._airmen
      .filter(airman => airman.model.flightId === flightId)
      .filter(airman => airmenIds.find(i => i === airman.model.id) !== undefined)
      .forEach(airman => {
        airman.model.shift = shift;
        airman.setSelected(false);
      });
  }

  @action.bound
  setSchedulePrompt(flightId: number, scheduleId: number) {
    this._shouldShowSchedulePrompt = true;
    this._pendingFlightId = flightId;
    this._pendingScheduleId = scheduleId;
  }

  @action.bound
  setShiftPrompt(flightId: number, shift: ShiftType) {
    this._shouldShowShiftPrompt = true;
    this._pendingFlightId = flightId;
    this._pendingShift = shift;
  }

  @action.bound
  setSelectedShift(shift: ShiftType) {
    this._selectedShift = shift;
  }

  @action.bound
  setSelectedSchedule(id: number) {
    this._selectedScheduleId = id;
  }

  @action.bound
  setAirmenScheduleByFlightId(flightId: number, airmen: AirmanModel[]) {
    Selectable.transform(airmen)
    .forEach(updatedAirman => {
      this._airmen = this._airmen.map(airman => {
        if (airman.model.id === updatedAirman.model.id) {
          return updatedAirman;
        } else {
          return airman;
        }
      });
    });
  }

  @action.bound
  setPendingScheduleStartDate(input: Moment) {
    this._pendingScheduleStartDate = moment(input);
  }

  @action.bound
  setAddNewFlightPrompt() {
    this._shouldShowAddFlightPrompt = true;
  }

  @action.bound
  setPendingFlightName(name: string) {
    if (this._pendingNewFlight) {
      this._pendingNewFlight.name = name;
    }
  }

  @action.bound
  addPendingNewFlight() {
    this._pendingNewFlight = FlightModel.empty();
    this._pendingNewFlight.squadronId = this._squadron.id;
  }

  @action.bound
  cancelPendingNewFlight() {
    this._pendingNewFlight = null;
  }

  @action.bound
  async savePendingNewFlight() {
    if (this._pendingNewFlight) {
      await this.flightRepository.save(this._pendingNewFlight);
      this._pendingNewFlight = null;
    }
  }

  @action.bound
  async deleteFlight(flightId: number) {
    await this.flightRepository.delete(flightId);
  }

  @action.bound
  async refreshFlights() {
    const site = await this.siteRepository.findOne(this._profile!.siteId!);

    if (site) {
      const squadronId = this._profile!.squadronId ? this._profile!.squadronId : this._squadron.id;
      const squad = site.squadrons.find((squadron: SquadronModel) => squadron.id === squadronId);
      this._squadron = squad ? squad : this._squadron;
    }
  }

  @action.bound
  setPendingOperatorFlightId(flightId: number | null) {
    this._pendingOperatorFlightId = flightId;
  }

  @action.bound
  makePendingAirman() {
    const flightId = this._pendingOperatorFlightId!;
    let scheduleId = Number(this.getScheduleIdByFlightId(flightId));

    if (!scheduleId) {
      scheduleId = 1;
    }

    const schedule = this.getScheduleByScheduleId(scheduleId);
    const airmanSchedule = new AirmanScheduleModel(-1, schedule!, moment());

    return new AirmanModel(
      -1,
      flightId,
      this._squadron.id,
      this._profile!.siteId!,
      '',
      '',
      new RankModel(-1, ''),
      [],
      [],
      [airmanSchedule],
      this.getShiftByFlightId(flightId)!
    );
  }
}