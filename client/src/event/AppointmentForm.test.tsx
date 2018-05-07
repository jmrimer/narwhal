import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { AppointmentForm } from './AppointmentForm';
import { eventStub } from '../utils/testUtils';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledButton } from '../widgets/Button';
import { EventModelFactory } from './factories/EventModelFactory';
import { AppointmentFormStore } from './stores/AppointmentFormStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DoubleRepositories } from '../utils/Repositories';

/* tslint:disable:no-empty*/
describe('AppointmentForm', () => {
  let trackerStore: TrackerStore;
  let appointmentFormStore: AppointmentFormStore;
  let wrapper: ShallowWrapper;
  let subject: AppointmentForm;
  let eventActions: any;

  beforeEach(() => {
    eventActions = {
      handleFormSubmit: jest.fn(),
      handleDeleteEvent: jest.fn(),
    };

    trackerStore = new TrackerStore(DoubleRepositories);
    appointmentFormStore = new AppointmentFormStore(new TimeServiceStub());

    wrapper = shallow(
      <AppointmentForm
        airmanId={123}
        appointmentFormStore={appointmentFormStore}
        trackerStore={trackerStore}
        eventActions={eventActions}
      />
    );

    subject = (wrapper.instance() as AppointmentForm);
  });

  it('manages the state via form changes', () => {
    subject.handleChange({target: {name: 'title', value: 'Title'}});
    subject.handleChange({target: {name: 'description', value: 'Description'}});
    subject.handleChange({target: {name: 'startDate', value: '2018-02-22'}});
    subject.handleChange({target: {name: 'startTime', value: '1200'}});
    subject.handleChange({target: {name: 'endDate', value: '2018-02-22'}});
    subject.handleChange({target: {name: 'endTime', value: '1300'}});

    expect(appointmentFormStore.state).toEqual({
      title: 'Title',
      description: 'Description',
      startDate: '2018-02-22',
      startTime: '1200',
      endDate: '2018-02-22',
      endTime: '1300'
    });
  });

  it('should render a delete button', () => {
    appointmentFormStore.open(EventModelFactory.build());
    wrapper.update();
    expect(wrapper.find(StyledButton).prop('onClick')).toEqual(subject.handleDelete);
  });

  it('renders with field validation', () => {
    expect(wrapper.find(StyledFieldValidation).at(0).prop('fieldName')).toBe('title');
    expect(wrapper.find(StyledFieldValidation).at(1).prop('fieldName')).toBe('validDateRange');
    expect(wrapper.find(StyledFieldValidation).at(2).prop('fieldName')).toBe('startTime');
    expect(wrapper.find(StyledFieldValidation).at(3).prop('fieldName')).toBe('endTime');
  });

  it('populates the fields with values from AppointmentFormStore', () => {
    appointmentFormStore.setState('title', 'Title');
    appointmentFormStore.setState('description', 'Description');
    appointmentFormStore.setState('startDate', '2018-02-22');
    appointmentFormStore.setState('startTime', '1200');
    appointmentFormStore.setState('endDate', '2018-02-22');
    appointmentFormStore.setState('endTime', '1300');

    wrapper.update();

    expect(findInputValueByName(wrapper, StyledTextInput, 'title')).toEqual(appointmentFormStore.state.title);
    expect(
      findInputValueByName(wrapper, StyledTextInput, 'description')
    ).toEqual(appointmentFormStore.state.description);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startDate')).toEqual(appointmentFormStore.state.startDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'startTime')).toEqual(appointmentFormStore.state.startTime);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endDate')).toEqual(appointmentFormStore.state.endDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'endTime')).toEqual(appointmentFormStore.state.endTime);
  });

  it('add an Appointment', async () => {
    await subject.handleSubmit(eventStub);
    expect(eventActions.handleFormSubmit).toHaveBeenCalled();
  });

  it('remove an Appointment', async () => {
    appointmentFormStore.open(EventModelFactory.build());
    await subject.handleDelete();
    expect(eventActions.handleDeleteEvent).toHaveBeenCalled();
  });
});

function findInputValueByName(subject: ShallowWrapper, component: any, name: string) {
  return subject.find(component).findWhere(c => c.prop('name') === name).prop('value');
}