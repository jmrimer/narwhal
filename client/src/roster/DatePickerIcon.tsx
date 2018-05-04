import * as React from 'react';

const d = `M 11 7.375L 11 8.625C 11 8.72917 10.9635 8.81771 10.8906 8.89062C 10.8177 8.96354 10.7292
   9 10.625 9L 9.375 9C 9.27083 9 9.18229 8.96354 9.10938 8.89062C 9.03646 8.81771 9 8.72917 9 8.625L
   9 7.375C 9 7.27083 9.03646 7.18229 9.10938 7.10938C 9.18229 7.03646 9.27083 7 9.375 7L 10.625 7C 
  10.7292 7 10.8177 7.03646 10.8906 7.10938C 10.9635 7.18229 11 7.27083 11 7.375ZM 11 10.375L 11 11.625C
   11 11.7292 10.9635 11.8177 10.8906 11.8906C 10.8177 11.9635 10.7292 12 10.625 12L 9.375 12C 9.27083
   12 9.18229 11.9635 9.10938 11.8906C 9.03646 11.8177 9 11.7292 9 11.625L 9 10.375C 9 10.2708 9.03646 
  10.1823 9.10938 10.1094C 9.18229 10.0365 9.27083 10 9.375 10L 10.625 10C 10.7292 10 10.8177 10.0365 
  10.8906 10.1094C 10.9635 10.1823 11 10.2708 11 10.375ZM 4.99999 7.375L 4.99999 8.625C 4.99999 8.72917 
  4.96353 8.81771 4.89061 8.89062C 4.81769 8.96354 4.72915 9 4.62499 9L 3.37499 9C 3.27082 9 3.18228 8.96354
   3.10936 8.89062C 3.03644 8.81771 2.99999 8.72917 2.99999 8.625L 2.99999 7.375C 2.99999 7.27083 3.03644 
  7.18229 3.10936 7.10938C 3.18228 7.03646 3.27082 7 3.37499 7L 4.62499 7C 4.72915 7 4.81769 7.03646 4.89061
   7.10938C 4.96353 7.18229 4.99999 7.27083 4.99999 7.375ZM 4.99999 10.375L 4.99999 11.625C 4.99999 11.7292 
  4.96353 11.8177 4.89061 11.8906C 4.81769 11.9635 4.72915 12 4.62499 12L 3.37499 12C 3.27082 12 3.18228 11.9635 
  3.10936 11.8906C 3.03644 11.8177 2.99999 11.7292 2.99999 11.625L 2.99999 10.375C 2.99999 10.2708 3.03644 10.1823 
  3.10936 10.1094C 3.18228 10.0365 3.27082 10 3.37499 10L 4.62499 10C 4.72915 10 4.81769 10.0365 4.89061 10.1094C 
  4.96353 10.1823 4.99999 10.2708 4.99999 10.375ZM 8.00001 7.375L 8.00001 
  8.625C 8.00001 8.72917 7.96356 8.81771 7.89064 8.89062C 7.81772 8.96354 7.72918 9 7.62501 9L 6.37501 9C 6.27085 
  9 6.18231 8.96354 6.10939 8.89062C 6.03647 8.81771 6.00001 8.72917 6.00001 8.625L 6.00001 7.375C 6.00001 7.27083 
  6.03647 7.18229 6.10939 7.10938C 6.18231 7.03646 6.27085 7 6.37501 7L 7.62501 7C 7.72918 7 7.81772 7.03646 7.89064 
  7.10938C 7.96356 7.18229 8.00001 7.27083 8.00001 7.375ZM 8.00001 10.375L 8.00001 11.625C 8.00001 11.7292 7.96356 
  11.8177 7.89064 11.8906C 7.81772 11.9635 7.72918 12 7.62501 12L 6.37501 12C 6.27085 12 6.18231 11.9635 6.10939 
  11.8906C 6.03647 11.8177 6.00001 11.7292 6.00001 11.625L 6.00001 10.375C 6.00001 10.2708 6.03647 10.1823 6.10939 
  10.1094C 6.18231 10.0365 6.27085 10 6.37501 10L 7.62501 10C 7.72918 10 7.81772 10.0365 7.89064 10.1094C 7.96356 
  10.1823 8.00001 10.2708 8.00001 10.375ZM 14 3.5L 14 14.5C 14 14.9167 13.8542 15.2708 13.5625 15.5625C 13.2709 
  15.8542 12.9167 16 12.5 16L 1.5 16C 1.08334 16 0.729168 15.8542 0.437501 15.5625C 0.145834 15.2708 0 14.9167 0 
  14.5L 0 3.5C 0 3.08333 0.145834 2.72917 0.437501 2.4375C 0.729168 2.14583 1.08334 2 1.5 2L 3.00001 2L 3.00001 
  0.375C 3.00001 0.270834 3.03647 0.182292 3.10938 0.109375C 3.1823 0.0364585 3.27084 0 3.37501 0L 4.62501 0C 4.72918 
  0 4.81772 0.0364585 4.89064 0.109375C 4.96355 0.182292 5.00001 0.270834 5.00001 0.375L 5.00001 2L 9.00002 2L 
  9.00002 0.375C 9.00002 0.270834 9.03648 0.182292 9.1094 0.109375C 9.18231 0.0364585 9.27086 0 9.37502 0L 10.625 
  0C 10.7292 0 10.8177 0.0364585 10.8907 0.109375C 10.9636 0.182292 11 0.270834 11 0.375L 11 2L 12.5 2C 12.9167 2 
  13.2709 2.14583 13.5625 2.4375C 13.8542 2.72917 14 3.08333 14 3.5ZM 12.5 14.3125L 12.5 5L 1.5 5L 1.5 14.3125C 
  1.5 14.3542 1.52083 14.3958 1.5625 14.4375C 1.60417 14.4792 1.64583 14.5 1.6875 14.5L 12.3125 14.5C 12.3542 14.5 
  12.3958 14.4792 12.4375 14.4375C 12.4792 14.3958 12.5 14.3542 12.5 14.3125Z`;

interface Props {
  fill?: string;
}

export const DatePickerIcon = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill={props.fill ? props.fill : '#fff'}
    >
      <path
        d={d}
        transform="translate(1 0)"
      />
    </svg>
  );
};