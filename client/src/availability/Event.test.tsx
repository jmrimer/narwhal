import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Event } from './Event';
import * as moment from 'moment';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { AvailabilityActions } from './AvailabilityActions';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledAvailabilityTile } from './AvailabilityTile';
import { EventModelFactory } from '../event/factories/EventModelFactory';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { makeFakeProfile } from '../utils/testUtils';
import { writerAbility } from '../app/abilities';
import { BabyPlusIcon } from '../icons/BabyPlusIcon';

describe('Event', () => {
  let subject: ShallowWrapper;
  let availabilityStore: AvailabilityStore;
  let availabilityActions: AvailabilityActions;
  let profileStore: ProfileSitePickerStore;

  beforeEach(async () => {
    availabilityActions = new AvailabilityActions({});
    availabilityActions.openEventFormForDay = jest.fn();
    availabilityStore = new AvailabilityStore(DoubleRepositories);
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate([], makeFakeProfile('WRITER', writerAbility));
    const event = EventModelFactory.build('', '', moment('2017-11-26'), moment('2017-11-26'));
    availabilityStore.setAirmanEvents([event]);
    subject = shallow(
      <Event
        day={moment('2017-11-26')}
        availabilityStore={availabilityStore}
        availabilityActions={availabilityActions}
        profileStore={profileStore}
      />
    );
  });

  it('renders Add Events buttons', () => {
    expect(subject.find('.add-event-on-date').exists()).toBeTruthy();
    expect(subject.find('.add-event-on-date').find(BabyPlusIcon)).toBeTruthy();
    expect(subject.find('.add-event-on-date').text()).toContain('Add Event');
  });

  it('calls the createEvent on date click', () => {
    subject.find('.event-date').at(0).simulate('click');
    expect(availabilityActions.openEventFormForDay).toHaveBeenCalledWith(moment('2017-11-26'));
  });

  it('renders a list of events', () => {
    expect(subject.find(StyledAvailabilityTile).length).toBe(1);
  });

  it('renders no events scheduled tile', () => {
    availabilityStore.setAirmanEvents([]);
    subject.update();
    expect(subject.text()).toContain('No Events Scheduled');
  });
});