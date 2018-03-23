import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { SiteModel } from '../../site/models/SiteModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { action, computed, observable } from 'mobx';
import { EventModel } from '../../event/models/EventModel';
import { EventRepository } from '../../event/repositories/EventRepository';
import SkillRepository from '../../skills/repositories/SkillRepository';
import { CurrencyStore } from '../../currency/stores/CurrencyStore';
import { AvailabilityStore } from '../../availability/stores/AvailabilityStore';
import { PlannerStore } from '../../roster/stores/PlannerStore';
import { MissionStore } from '../../mission/stores/MissionStore';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { MissionRepository } from '../../mission/repositories/MissionRepository';
import { TimeService } from '../services/TimeService';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { MissionFormStore } from '../../event/stores/MissionFormStore';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';
import { EventActions } from '../../event/stores/EventActions';
import { SidePanelStore, TabType } from './SidePanelStore';
import { Moment } from 'moment';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';

export class TrackerStore implements EventActions {
  public currencyStore: CurrencyStore;
  public availabilityStore: AvailabilityStore;
  public plannerStore: PlannerStore;
  public missionStore: MissionStore;
  public sidePanelStore: SidePanelStore;
  public rosterHeaderStore: RosterHeaderStore;

  private airmanRepository: AirmanRepository;
  private siteRepository: SiteRepository;
  private skillRepository: SkillRepository;
  private eventRepository: EventRepository;

  @observable private _loading: boolean = false;

  @observable private _airmen: AirmanModel[] = [];
  @observable private _sites: SiteModel[] = [];

  @observable private _siteId: number = UnfilteredValue;
  @observable private _squadronId: number = UnfilteredValue;
  @observable private _flightId: number = UnfilteredValue;

  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();
  @observable private _pendingDeleteEvent: EventModel | null = null;

  constructor(airmanRepository: AirmanRepository,
              siteRepository: SiteRepository,
              skillRepository: SkillRepository,
              eventRepository: EventRepository,
              timeService: TimeService,
              missionRepository: MissionRepository,
              ripItemRepository: RipItemRepository) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.skillRepository = skillRepository;
    this.eventRepository = eventRepository;

    const missionStore = new MissionStore(missionRepository);
    this.currencyStore = new CurrencyStore(new SkillFormStore(this), ripItemRepository);

    this.availabilityStore = new AvailabilityStore(
      new AppointmentFormStore(this),
      new LeaveFormStore(this),
      new MissionFormStore(this, missionStore));

    this.missionStore = missionStore;
    this.plannerStore = new PlannerStore(timeService);
    this.sidePanelStore = new SidePanelStore();
    this.rosterHeaderStore = new RosterHeaderStore(this);
  }

  async hydrate(siteId: number = UnfilteredValue) {
    this._loading = true;

    const results = await Promise.all([
      this.siteRepository.findAll(),
      this.airmanRepository.findAll(),
      this.skillRepository.findAllCertifications(),
      this.skillRepository.findAllQualifications(),
      this.missionStore.hydrate(),
    ]);

    this._sites = results[0];
    this._airmen = results[1];

    this.rosterHeaderStore.hydrate(results[2], results[3]);
    this.currencyStore.hydrate(results[2], results[3]);

    if (this._siteId === UnfilteredValue) {
      this.setSiteId(siteId);
    }

    this._loading = false;
  }

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  setLoading(loading: boolean) {
    this._loading = loading;
  }

  @computed
  get airmen() {
    const airmen = this._airmen
      .filter(this.bySite)
      .filter(this.bySquadron)
      .filter(this.byFlight);
    return this.rosterHeaderStore.filterAirmen(airmen);
  }

  @computed
  get sites() {
    return this._sites;
  }

  @computed
  get siteOptions() {
    return this._sites.map(site => {
      return {value: site.id, label: site.name};
    });
  }

  @computed
  get siteId() {
    return this._siteId;
  }

  @action.bound
  setSiteId(id: number) {
    if (this._siteId !== id) {
      this._siteId = id;
      const site = this._sites.find(s => s.id === this._siteId);

      if (site && site.squadrons.length === 1) {
        this.setSquadronId(site.squadrons[0].id);
      } else {
        this.setSquadronId(UnfilteredValue);
      }
    }
  }

  @computed
  get squadronOptions() {
    if (this._siteId === UnfilteredValue) {
      return [];
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return [];
    }

    return site.squadrons.map(squad => {
      return {value: squad.id, label: squad.name};
    });
  }

  @computed
  get squadronId() {
    return this._squadronId;
  }

  @action.bound
  setSquadronId(id: number) {
    if (this._squadronId !== id) {
      this._squadronId = id;
      this.setFlightId(UnfilteredValue);
    }
  }

  @computed
  get flightOptions() {
    if (this._siteId === UnfilteredValue || this._squadronId === UnfilteredValue) {
      return [];
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return [];
    }

    const squadron = site.squadrons.find(s => s.id === this._squadronId);
    if (squadron == null) {
      return [];
    }

    return squadron.flights.map(flight => {
      return {value: flight.id, label: flight.name};
    });
  }

  @computed
  get flightId() {
    return this._flightId;
  }

  @action.bound
  setFlightId(id: number) {
    this._flightId = id;
  }

  @computed
  get selectedAirman() {
    return this._selectedAirman;
  }

  @action.bound
  setSelectedAirman(airman: AirmanModel, tab: TabType) {
    this._selectedAirman = airman;
    this.currencyStore.airmanRipItemFormStore.setRipItems(airman.ripItems);
    this.sidePanelStore.setSelectedTab(tab);
    this.plannerStore.setSidePanelWeek(
      airman.isEmpty ?
        this.plannerStore.plannerWeek :
        this.plannerStore.sidePanelWeek
    );
  }

  @action.bound
  clearSelectedAirman() {
    this.availabilityStore.closeEventForm();
    this.setSelectedAirman(AirmanModel.empty(), TabType.AVAILABILITY);
  }

  @action.bound
  async addEvent(event: EventModel) {
    try {
      const addedEvent = await this.eventRepository.save(event);
      await this.refreshAirmen(event);
      this.availabilityStore.closeEventForm();
      return addedEvent;
    } catch (e) {
      this.availabilityStore.setFormErrors(e);
      return event;
    }
  }

  @computed
  get pendingDeleteEvent() {
    return this._pendingDeleteEvent;
  }

  @action.bound
  removeEvent(event: EventModel) {
    this._pendingDeleteEvent = event;
  }

  @action.bound
  newEvent(airman: AirmanModel, date: Moment) {
    this._selectedAirman = airman;
    this.sidePanelStore.setSelectedTab(TabType.AVAILABILITY);
    this.availabilityStore.showEventForm(date);
  }

  @action.bound
  cancelPendingDelete() {
    this._pendingDeleteEvent = null;
  }

  @action.bound
  async executePendingDelete() {
    if (this._pendingDeleteEvent == null) {
      return;
    }
    try {
      await this.eventRepository.delete(this._pendingDeleteEvent);
      await this.refreshAirmen(this._pendingDeleteEvent);
      this.availabilityStore.closeEventForm();
    } catch (e) {
      this.availabilityStore.setFormErrors(e);
    }
    this._pendingDeleteEvent = null;
  }

  @action.bound
  async addSkill(skill: Skill) {
    try {
      await this.airmanRepository.saveSkill(skill);
      await this.refreshAirmen(skill);
    } catch (e) {
      this.currencyStore.setFormErrors(e);
    }
  }

  @action.bound
  async removeSkill(skill: Skill) {
    try {
      await this.airmanRepository.deleteSkill(skill);
      await this.refreshAirmen(skill);
    } catch (e) {
      this.currencyStore.setFormErrors(e);
    }
  }

  @action.bound
  async updateAirmanShift(airman: AirmanModel, shiftType: ShiftType) {
    const updatedAirman = Object.assign({}, airman, {shift: shiftType});
    await this.airmanRepository.saveAirman(updatedAirman);
    this._airmen = await this.airmanRepository.findAll();
  }

  private async refreshAirmen(item: { airmanId: number }) {
    this._airmen = await this.airmanRepository.findAll();
    this._selectedAirman = this._airmen.find(a => a.id === item.airmanId)!;
  }

  private bySite = (airman: AirmanModel) => {
    if (this._siteId === UnfilteredValue) {
      return true;
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return false;
    }

    return site.getAllFlightIds().includes(airman.flightId);
  }

  private bySquadron = (airman: AirmanModel) => {
    if (this._squadronId === UnfilteredValue) {
      return true;
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return false;
    }

    const squadron = site.squadrons.find(s => s.id === this._squadronId);
    if (squadron == null) {
      return false;
    }

    return squadron.getAllFlightIds().includes(airman.flightId);
  }

  private byFlight = (airman: AirmanModel) => {
    if (this._flightId === UnfilteredValue) {
      return true;
    }
    return airman.flightId === this._flightId;
  }
}
