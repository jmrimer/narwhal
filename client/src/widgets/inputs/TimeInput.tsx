import * as React from 'react';
import styled from 'styled-components';

interface Props {
  value: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  name: string;
  className?: string;
  disabled?: boolean;
}

export const TimeInput = (props: Props) => {
  return (
    <input
      className={props.className}
      type="text"
      placeholder="hhmm"
      value={props.value}
      name={props.name}
      onChange={props.onChange}
      onBlur={props.onBlur}
      disabled={props.disabled}
    />

  );
};

export const StyledTimeInput = styled(TimeInput)`  
  &::placeholder {
    color: ${props => props.theme.graySteel};
  }
  
  &:disabled {
    color: ${props => props.theme.graySteel};
    cursor: initial;
    font-style: italic;
    border: none;
  }
  
  background: none;
  color: ${props => props.theme.fontColor};
  border: none;
  border-bottom: 1px solid ${props => props.theme.graySteel};
  padding: 0;
  font: inherit;
  font-weight: 300;
  cursor: pointer;
`;