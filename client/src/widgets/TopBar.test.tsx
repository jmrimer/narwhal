import * as React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { TopBar } from './TopBar';
import { NavLink } from 'react-router-dom';
import { ProfileModel } from '../profile/models/ProfileModel';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { adminAbility, readerAbility } from '../app/abilities';
import { MemoryRouter } from 'react-router';
import { PendingEventStore } from './stores/PendingEventStore';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';
import { TopBarActions } from './TopBarActions';
import { stores } from '../app/stores';

describe('TopBar', async () => {
  let subject: ShallowWrapper;
  let profile: ProfileModel;
  let profileStore: ProfileSitePickerStore;
  let pendingEventStore: PendingEventStore;
  let topBarActions: TopBarActions;

  beforeEach(async () => {

    profile = {id: 1,
      username: 'Tytus',
      siteId: 14,
      siteName: '14',
      roleName: 'ADMIN',
      roleId: 1,
      classified: false,
      ability: adminAbility
    };

    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate([], profile);
    pendingEventStore = new PendingEventStore();
    topBarActions = new TopBarActions(stores, DoubleRepositories);
    pendingEventStore.hydrate(
      [],
      [],
      SiteModelFactory.build(1, 1)
    );
    subject = shallow(
      (
        <TopBar
          pendingEventStore={pendingEventStore}
          profileStore={profileStore}
          topBarActions={topBarActions}
        />
      )
    );
  });

  it('renders the username with role', () => {
    expect(subject.text()).toContain('Tytus');
    expect(subject.text()).toContain('(ADMIN)');
  });

  it('renders the page title', () => {
    expect(subject.text()).toContain('Narwhal');
  });

  it('renders all tabs', () => {
    expect(subject.find(NavLink).length).toBe(3);
  });

  it('should render a link to the Dashboard page', () => {
    expect(subject.find(NavLink).at(0).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(0).prop('to')).toBe('/dashboard');
  });

  it('should render a link to the Flights page', () => {
    expect(subject.find(NavLink).at(2).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(2).prop('to')).toBe('/flights');
  });

  it('should render a link to the Availability page', () => {
    expect(subject.find(NavLink).at(1).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(1).prop('to')).toBe('/');
  });

  it('should not see the mission or flight tab if a reader', async () => {
    profile = {
      id: 1,
      username: 'Tytus',
      siteId: 14,
      siteName: '14',
      roleName: 'READER',
      roleId: 1,
      classified: false,
      ability: readerAbility
    };
    await profileStore.hydrate([], profile);

    const mountedSubject = mount(
      <MemoryRouter>
        <TopBar
          pendingEventStore={pendingEventStore}
          profileStore={profileStore}
          topBarActions={topBarActions}
        />
      </MemoryRouter>
    );
    expect(mountedSubject.find('a .tab').length).toBe(1);
  });
});