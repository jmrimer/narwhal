import * as React from 'react';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { DeleteEventPopup } from './DeleteEventPopup';
import * as moment from 'moment';
import EventModel, { EventType } from '../event/models/EventModel';
import { shallow, ShallowWrapper } from 'enzyme';

const cancelPendingDeleteEvent = jest.fn();
const confirmPendingDeleteEvent = jest.fn();
const event = new EventModel('Title', 'Description', moment.utc(), moment.utc(), 1, EventType.Mission);
let subject: ShallowWrapper;

describe('DeleteEventPopup', () => {
  beforeEach(async () => {
    const trackerStore = await makeFakeTrackerStore();
    trackerStore.setPendingDeleteEvent(event);
    subject = shallow(
      <DeleteEventPopup
        event={trackerStore.pendingDeleteEvent!}
        cancelPendingDeleteEvent={cancelPendingDeleteEvent}
        confirmPendingDeleteEvent={confirmPendingDeleteEvent}
      />
    );
  });

  it('renders pending delete event details', async () => {
    const format = 'DD MMM YY HH:mm';
    const text = `Remove ${event.title}, from ${event.startTime.format(format)} - ${event.endTime.format(format)}`;
    expect(subject.html()).toContain(text);
  });

  it('properly calls cancel pending delete event', () => {
    subject.find('button.cancel').simulate('click');
    expect(cancelPendingDeleteEvent).toHaveBeenCalled();
  });

  it('properly calls confirm pending delete event', () => {
    subject.find('button.confirm').simulate('click');
    expect(confirmPendingDeleteEvent).toHaveBeenCalled();
  });
});
