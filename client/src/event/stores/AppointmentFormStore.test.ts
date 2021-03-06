import * as moment from 'moment';
import { AppointmentFormStore } from './AppointmentFormStore';
import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { TimeServiceStub } from '../../tracker/services/doubles/TimeServiceStub';

describe('AppointmenFormStore', () => {
  const airmanId = 123;
  let subject: AppointmentFormStore;
  let event: EventModel;

  beforeEach(() => {
    event = EventModelFactory.build();
    event.endTime = event.startTime.clone().add(1, 'hour');
    subject = new AppointmentFormStore(new TimeServiceStub());
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasModel).toBeFalsy();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors).toEqual({});
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasModel).toBeTruthy();
      expect(subject.state.title).toBe(event.title);
      expect(subject.state.description).toBe(event.description);
      expect(subject.state.startDate).toBe(event.startTime.format('YYYY-MM-DD'));
      expect(subject.state.startTime).toBe(event.startTime.format('HHmm'));
      expect(subject.state.endDate).toBe(event.endTime.format('YYYY-MM-DD'));
      expect(subject.state.endTime).toBe(event.endTime.format('HHmm'));
      expect(subject.errors).toEqual({});
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(event);
      expect(subject.hasModel).toBeTruthy();

      subject.close();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors).toEqual({});
      expect(subject.hasModel).toBeFalsy();
    });
  });

  it('can add an event', () => {
    subject.setState('title', 'Title');
    subject.setState('description', 'Description');
    subject.setState('startDate', '2018-02-22');
    subject.setState('startTime', '1200');
    subject.setState('endDate', '2018-02-22');
    subject.setState('endTime', '1300');

    const expectedEvent = new EventModel(
      'Title',
      'Description',
      moment('2018-02-22 1200', 'YYYY-MM-DD HHmm'),
      moment('2018-02-22 1300', 'YYYY-MM-DD HHmm'),
      airmanId,
      EventType.Appointment
    );

    expect(subject.stateToModel(airmanId)).toEqual(expectedEvent);
  });

  it('ensures that at least dates are included in the appointment submission', () => {
    subject.setState('title', 'Title');
    subject.setState('description', 'Description');
    subject.setState('startDate', '');
    subject.setState('startTime', '0000');
    subject.setState('endDate', '2018-02-22');
    subject.setState('endTime', '2359');

    const addedEvent = subject.stateToModel(airmanId);

    expect(addedEvent.startTime.isValid()).toBeFalsy();
  });

  describe('auto-populating date and time fields', () => {
    it('should auto-populate empty end data field when setting start date', () => {
      subject.setState('startDate', '2018-02-22');
      expect(subject.state.endDate).toEqual('2018-02-22');
    });

    it('should auto-populate empty end time field when setting start time', () => {
      subject.setState('startTime', '0800');
      expect(subject.state.endTime).toEqual('0900');
    });

    it('should not populate the end time if the start time is incomplete', () => {
      subject.setState('startTime', '08');
      expect(subject.state.endTime).toEqual('');
    });

    it('should keep the end date when modifying the start date', () => {
      subject.setState('startDate', '2018-02-22');
      subject.setState('endDate', '2018-02-23');
      subject.setState('startDate', '2018-02-25');
      expect(subject.state.endDate).toEqual('2018-02-23');
    });

    it('should keep the end time when modifying the start time', () => {
      subject.setState('startTime', '0800');
      subject.setState('endTime', '0900');
      subject.setState('startTime', '1000');
      expect(subject.state.endTime).toEqual('0900');
    });
  });
});