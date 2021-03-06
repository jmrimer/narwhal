import * as React from 'react';

interface Props {
  width: number;
  height: number;
}

export const NextIcon = (props: Props) => {
  return (
    <svg width={props.width} height={props.height} viewBox="0 0 24 24">
      <path fill="#FFF" fillRule="evenodd" d="M18 12L6 24V0z"/>
    </svg>
  );
};
