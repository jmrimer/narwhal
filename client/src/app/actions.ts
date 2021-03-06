import { MomentTimeService } from '../tracker/services/MomentTimeService';
import { EventActions } from '../event/EventActions';
import { PlannerActions } from '../roster/PlannerActions';
import { AvailabilityActions } from '../availability/AvailabilityActions';
import { stores } from './stores';
import { MissionPlannerActions } from '../crew/MissionPlannerActions';
import { SidePanelActions } from '../tracker/SidePanelActions';
import { ProfileActions } from '../site-manager/actions/ProfileActions';
import { CurrencyActions } from '../currency/CurrencyActions';
import { RipItemsActions } from '../rip-item/RipItemsActions';
import { SkillActions } from '../skills/SkillActions';
import { TrackerActions } from '../tracker/TrackerActions';
import { AppActions } from './AppActions';
import { WebRepositories } from '../utils/Repositories';
import { SiteManagerActions } from '../site-manager/actions/SiteManagerActions';
import { CertificationActions } from '../skills/certification/CertificationActions';
import { TopBarActions } from '../widgets/TopBarActions';
import { AdminSquadronActions } from '../admin/actions/AdminSquadronActions';

const adminSquadronActions = new AdminSquadronActions(stores, WebRepositories);
const availabilityActions = new AvailabilityActions(stores);
const missionPlannerActions = new MissionPlannerActions(stores);
const currencyActions = new CurrencyActions(stores);
const eventActions = new EventActions(stores, new MomentTimeService());
const ripItemsActions = new RipItemsActions(stores);
const plannerActions = new PlannerActions(stores);
const profileActions = new ProfileActions(stores, WebRepositories);
const skillActions = new SkillActions(stores);
const sidePanelActions = new SidePanelActions(stores, new MomentTimeService());
const trackerActions = new TrackerActions(stores);
const appActions = new AppActions(stores, WebRepositories);
const siteManagerActions = new SiteManagerActions(stores, WebRepositories);
const certificationActions = new CertificationActions(stores, WebRepositories);
const topBarActions = new TopBarActions(stores, WebRepositories);

export const actions = {
  adminSquadronActions,
  availabilityActions,
  missionPlannerActions,
  currencyActions,
  eventActions,
  ripItemsActions,
  plannerActions,
  profileActions,
  skillActions,
  sidePanelActions,
  trackerActions,
  appActions,
  siteManagerActions,
  certificationActions,
  topBarActions,
};