import * as React from 'react';
import styled from 'styled-components';

interface Props {
  text: string;
  className?: string;
}

export const SubmitButton = (props: Props) => {
  return (
    <input className={props.className} type="submit" value={props.text}/>
  );
};

export const StyledSubmitButton = styled(SubmitButton)`
  width: fit-content;
  background: ${props => props.theme.yellow};
  color: ${props => props.theme.darkest};
  border: none;
  padding: 0.5rem 1rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  outline: inherit;
  
  &:hover {
    background: ${props => props.theme.yellowHover};
    color: ${props => props.theme.darkest};
  }
`;