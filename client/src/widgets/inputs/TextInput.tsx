import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';

/* tslint:disable:no-any */
interface Props {
  value?: string;
  name: string;
  onChange: (e: any) => void;
  onKeyPress?: (e: any) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
}

@observer
export class TextInput extends React.Component<Props> {
  render() {
    return (
      <input
        id={this.props.id}
        className={this.props.className}
        type="text"
        placeholder={this.props.placeholder}
        value={this.props.value === undefined ? '' : this.props.value}
        name={this.props.name}
        onChange={this.props.onChange}
        onKeyPress={this.props.onKeyPress}
        disabled={this.props.disabled}
        maxLength={this.props.maxLength === undefined ? 15 : this.props.maxLength}
      />
    );
  }
}

export const StyledTextInput = styled(TextInput)`
  &::placeholder {
   color: ${props => props.theme.graySteel};
  }
  
  background: none;
  color: ${props => props.theme.fontColor};
  border: none;
  border-bottom: 1px solid ${props => props.theme.graySteel};
  padding: 0;
  font: inherit;
  font-weight: 300;
  cursor: pointer;
  outline: inherit;
  width: 100%;
  
  &:disabled {
    color: ${props => props.theme.graySteel};
    cursor: initial;
  }
`;
