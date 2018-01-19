import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Roster from '../roster/Roster';
import { Tracker } from './Tracker';
import { makeFakeTrackerStore } from '../utils/testUtils';
import SidePanel from './SidePanel/SidePanel';
import AirmanModel from '../airman/models/AirmanModel';
import PlannerServiceStub from './services/doubles/PlannerServiceStub';
import TopBar from '../widgets/TopBar';
import TrackerStore from './stores/TrackerStore';

const plannerServiceStub = new PlannerServiceStub();

let trackerStore: TrackerStore;
let subject: ReactWrapper;

describe('Tracker', () => {
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    subject = mount(
      <Tracker
        username="Tytus"
        trackerStore={trackerStore}
        plannerService={plannerServiceStub}
      />
    );
  });

  it('renders a Roster with the current week', async () => {
    expect(subject.find(Roster).prop('week')).toEqual(plannerServiceStub.getCurrentWeek());
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('AVAILABILITY ROSTER');
  });

  describe('the side panelStore', () => {
    it('does not render without a selected airman', () => {
      trackerStore.setSelectedAirman(AirmanModel.empty());
      subject.update();
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });

    it('populates the side panelStore with the selected airman', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');

      const sidePanel = subject.find(SidePanel);
      expect(sidePanel.exists()).toBeTruthy();
      expect(sidePanel.text()).toContain(trackerStore.airmen[0].lastName);
      expect(sidePanel.text()).toContain(trackerStore.airmen[0].firstName);
    });

    it('closes the sidepanel', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');
      subject.find(SidePanel).find('button').at(0).simulate('click');
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });

  });
});
