import * as React from 'react';
import { Dashboard } from './Dashboard';
import { mount, ReactWrapper } from 'enzyme';
import { forIt } from '../utils/testUtils';
import { MissionModel } from '../mission/models/MissionModel';
import { DashboardStore } from './stores/DashboardStore';
import { StyledMission } from '../mission/Mission';
import { MemoryRouter } from 'react-router';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledMissionCardSection } from './MissionCardSection';
import { ThemeProvider } from 'styled-components';
import { Theme } from '../themes/default';
import { StyledMultiTypeahead } from '../widgets/inputs/MultiTypeahead';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { Provider } from 'mobx-react';

const missionRepositoryStub = DoubleRepositories.missionRepository;

describe('Dashboard', () => {
  let missions: MissionModel[];
  let subject: ReactWrapper;
  let dashboardStore: DashboardStore;

  beforeEach(async () => {
    missions = await missionRepositoryStub.findAll();

    dashboardStore = new DashboardStore(DoubleRepositories);

    subject = mount(
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
          <Provider dashboardStore={dashboardStore}>
            <Dashboard/>
          </Provider>
        </MemoryRouter>
      </ThemeProvider>
    );
    await forIt();
    subject.update();
  });

  it('renders a Dashboard with all missions', () => {
    expect(subject.find(StyledMission).length).toBe(19);
    expect(dashboardMissions(subject)).toEqual(missions);
  });

  it('should render a platform filter with options', () => {
    expect(subject.find(StyledMultiTypeahead).prop('options')).toBe(dashboardStore.platformOptions);
  });

  it('should render an ato mission id search field', () => {
    dashboardStore.handleFilterMission = jest.fn();
    subject.setProps(dashboardStore);
    expect(subject.find(StyledTextInput).exists()).toBeTruthy();
    subject.find(StyledTextInput).simulate('change', {target: {value: 'mission1'}});
    expect(dashboardStore.handleFilterMission).toHaveBeenCalledWith('mission1');
  });

  it('should set the mission filter value to dashBoard missionIdFilter', () => {
    dashboardStore.handleFilterMission('fooface');
    subject.update();
    expect(subject.find(StyledTextInput).prop('value')).toBe('fooface');
  });

  describe('sorting', () => {
    it('should render 5 Mission Card Sections', () => {
      expect(subject.find(StyledMissionCardSection).length).toBe(5);
    });

    it('should render in one section the mission for only the next 24 hours', () => {
      const section = subject.find(StyledMissionCardSection).at(0);
      expect(section.find('h2').text()).toContain('NEXT 24 HOURS');
      expect(section.find(StyledMission).length).toBe(2);
    });

    it('should render in one section the mission from more than 24 hours but less than 72 hours', () => {
      const section = subject.find(StyledMissionCardSection).at(1);
      expect(section.find('h2').text()).toContain('NEXT 72 HOURS');
      expect(section.find(StyledMission).length).toBe(2);
    });

    it('should render in one section the mission from more than 72 hours but less 7 days', () => {
      const section = subject.find(StyledMissionCardSection).at(2);
      expect(section.find('h2').text()).toContain('THIS WEEK');
      expect(section.find(StyledMission).length).toBe(1);
    });

    it('should render in one section the mission from more than 1 week but less 2 weeks', () => {
      const section = subject.find(StyledMissionCardSection).at(3);
      expect(section.find('h2').text()).toContain('NEXT WEEK');
      expect(section.find(StyledMission).length).toBe(1);
    });

    it('should render in one section the mission from more than 2 weeks but less 30 days', () => {
      const section = subject.find(StyledMissionCardSection).at(4);
      expect(section.find('h2').text()).toContain('LONG RANGE');
      expect(section.find(StyledMission).length).toBe(13);
    });
  });
});

function dashboardMissions(wrapper: ReactWrapper) {
  return wrapper.find(StyledMission).map(mission => mission.props().mission);
}