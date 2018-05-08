import { Stores } from '../stores';

export class MissionPlannerActions {
  constructor (private stores: Partial<Stores>) {
  }

  async refreshAirman() {
    const {missionPlannerStore, locationFilterStore} = this.stores;
    await missionPlannerStore!.refreshAllAirmen(locationFilterStore!.selectedSiteId);
  }

  async submit() {
    const {missionPlannerStore, locationFilterStore, crewStore} = this.stores;
    await crewStore!.save();
    await missionPlannerStore!.refreshAllEvents(locationFilterStore!.selectedSiteId);
  }

  async submitAndPrint() {
    await this.submit();
    (window as any).print();
  }
}
