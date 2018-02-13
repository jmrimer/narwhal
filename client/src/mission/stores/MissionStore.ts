import { computed, observable } from 'mobx';
import { MissionModel } from '../models/MissionModel';
import MissionRepository from '../repositories/MissionRepository';

export default class MissionStore {
  private missionRepository: MissionRepository;

  @observable private _missions: MissionModel[] = [];

  constructor(missionRepository: MissionRepository) {
    this.missionRepository = missionRepository;
  }

  async hydrate() { this._missions = await this.missionRepository.findAll(); }

  @computed
  get missions() {
    return this._missions;
  }

  @computed
  get missionOptions() {
    return this._missions.map(msn => {
      return {value: msn.missionId, label: msn.atoMissionNumber};
    });
  }
}