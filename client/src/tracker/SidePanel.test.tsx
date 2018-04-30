import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SidePanel } from './SidePanel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledCurrency } from '../currency/Currency';
import { TrackerStore } from './stores/TrackerStore';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { CertificationModelFactory } from '../skills/factories/CertificationModelFactory';
import * as moment from 'moment';
import { TabAlert } from '../icons/TabAlert';
import { StyledTab } from './Tab';
import { SidePanelStore, TabType } from './stores/SidePanelStore';
import { DoubleRepositories } from '../utils/Repositories';

describe('SidePanel', () => {
  let airman: AirmanModel;
  let trackerStore: TrackerStore;
  let subject: ShallowWrapper;
  let sidePanelStore: SidePanelStore;

  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    const certification = new AirmanCertificationModel(
      airman.id,
      CertificationModelFactory.build(1, 1),
      moment(),
      moment().subtract(3, 'year')
    );
    airman.certifications.push(certification);
    trackerStore = new TrackerStore(DoubleRepositories);
    trackerStore.setSelectedAirman(airman);
    sidePanelStore = new SidePanelStore();

    subject = shallow(
      <SidePanel
        trackerStore={trackerStore}
        sidePanelStore={sidePanelStore}
      />
    );
  });

  it('shows the airmans name', () => {
    expect(subject.text()).toContain(`${airman.lastName}, ${airman.firstName}`);
  });

  it('shows two tabs', () => {
    expect(subject.find(StyledTab).length).toBe(2);
    expect(subject.find(StyledTab).at(0).prop('title')).toBe('CURRENCY');
    expect(subject.find(StyledTab).at(1).prop('title')).toBe('AVAILABILITY');
  });

  it('should render the selectedTab from the SidePanelStore', () => {
    sidePanelStore.setSelectedTab(TabType.CURRENCY);
    subject.update();
    expect(subject.find(StyledCurrency).exists()).toBeTruthy();
  });

  it('renders the currency for a selected airman', () => {
    sidePanelStore.setSelectedTab(TabType.CURRENCY);
    subject.update();
    expect(subject.find(StyledCurrency).exists()).toBeTruthy();
  });

  it('makes the tab active when selected', () => {
    sidePanelStore.setSelectedTab(TabType.CURRENCY);
    subject.update();
    expect(subject.find(StyledTab).at(0).prop('isActive')).toBeTruthy();
    expect(subject.find(StyledTab).at(1).prop('isActive')).toBeFalsy();
  });

  it('shows a tab alert when the airman has an expired skill', () => {
    expect(subject.find(TabAlert).exists()).toBeTruthy();
  });
});