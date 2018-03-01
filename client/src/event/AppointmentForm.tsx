import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledButton } from '../widgets/Button';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { DeleteIcon } from '../icons/DeleteIcon';
import { AppointmentFormStore } from './stores/AppointmentFormStore';

interface Props {
  airmanId: number;
  appointmentFormStore: AppointmentFormStore;
  className?: string;
}

@observer
export class AppointmentForm extends React.Component<Props> {
  /* tslint:disable:no-any*/
  handleChange = ({target}: any) => {
    this.props.appointmentFormStore.setState({[target.name]: target.value});
  }

  handleDelete = () => {
    this.props.appointmentFormStore.removeItem();
  }

  /* tslint:disable:no-any*/
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.appointmentFormStore.addItem(this.props.airmanId);
  }

  render() {
    const {state, errors, hasItem} = this.props.appointmentFormStore;
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <StyledFieldValidation name="title" errors={errors}>
          <StyledFormRow>
            <StyledTextInput
              name="title"
              onChange={this.handleChange}
              placeholder="Title"
              value={state.title}
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFormRow>
          <StyledTextInput
            name="description"
            onChange={this.handleChange}
            placeholder="Description"
            value={state.description}
          />
        </StyledFormRow>

        <StyledFieldValidation name="startTime" errors={errors}>
          <StyledFormRow>
            <StyledDatePicker
              name="startDate"
              onChange={this.handleChange}
              value={state.startDate}
            />
            <StyledTimeInput
              name="startTime"
              onChange={this.handleChange}
              value={state.startTime}
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFieldValidation name="endTime" errors={errors}>
          <StyledFormRow>
            <StyledDatePicker
              name="endDate"
              onChange={this.handleChange}
              value={state.endDate}
            />
            <StyledTimeInput
              name="endTime"
              onChange={this.handleChange}
              value={state.endTime}
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
          {
            hasItem &&
            <StyledButton
              text="DELETE"
              onClick={this.handleDelete}
              renderIcon={() => <DeleteIcon/>}
            />
          }
        </StyledFormRow>
      </StyledForm>
    );
  }
}

export const StyledAppointmentForm = styled(AppointmentForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`;