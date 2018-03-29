import styled from 'styled-components';
import * as React from 'react';
import { observer } from 'mobx-react';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledButton } from '../widgets/Button';
import { DeleteIcon } from '../icons/DeleteIcon';
import { TDYDeploymentFormStore } from './stores/TDYDeploymentFormStore';

interface Props {
  airmanId: number;
  tdyDeploymentFormStore: TDYDeploymentFormStore;
  className?: string;
}

@observer
export class TDYDeploymentForm extends React.Component<Props> {
  handleChange = ({target}: any) => {
    this.props.tdyDeploymentFormStore.setState({[target.name]: target.value});
  }

  handleDelete = () => {
    this.props.tdyDeploymentFormStore.removeItem();
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.tdyDeploymentFormStore.addItem(this.props.airmanId);
  }

  render() {
    const {state, errors, hasItem} = this.props.tdyDeploymentFormStore;
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <StyledFormRow>
          <StyledFieldValidation name="title" errors={errors}>
            <StyledTextInput
              name="title"
              onChange={this.handleChange}
              placeholder="Title"
              value={state.title}
            />
          </StyledFieldValidation>
        </StyledFormRow>
        <StyledFormRow>
          <StyledTextInput
            name="description"
            onChange={this.handleChange}
            placeholder="Description"
            value={state.description}
          />
        </StyledFormRow>
        <StyledFieldValidation name="validDateRange" errors={errors}>
          <StyledFieldValidation name="startTime" errors={errors}>
            <StyledFormRow>
              <StyledDatePicker
                name="startTime"
                onChange={this.handleChange}
                value={state.startTime}
              />
            </StyledFormRow>
          </StyledFieldValidation>
          <StyledFieldValidation name="endTime" errors={errors}>
            <StyledFormRow>
              <StyledDatePicker
                name="endTime"
                onChange={this.handleChange}
                value={state.endTime}
              />
            </StyledFormRow>
          </StyledFieldValidation>
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

export const StyledTDYDeploymentForm = styled(TDYDeploymentForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`;