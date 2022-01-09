import { Theme } from '@emotion/react';

// The default Theme interface is empty so we need to define our own.
declare module '@emotion/react' {
  export interface Theme {
    borderRadius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      round: string;
    };
    boxShadow: {
      black: string;
      primary: string;
      primaryDarker: string;
    };
    colors: {
      black: string;
      gray: string;
      grayDark: string;
      grayDarker: string;
      grayLight: string;
      grayLighter: string;
      primary: string;
      primaryDarker: string;
      primaryLighter: string;
      white: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      bold: number;
      light: number;
      normal: number;
    };
    transition: string;
  }
}

export const theme: Theme = {
  borderRadius: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    round: '50%',
  },
  boxShadow: {
    black: '#000000 0px 0px 1px',
    primary: 'rgb(207, 0, 99) 0px 0px 0px 1pt',
    primaryDarker: 'rgb(181, 0, 87) 0px 0px 0px 1pt',
  },
  colors: {
    black: '#000000',
    gray: 'rgb(86, 90, 105)',
    grayDark: 'rgb(206, 208, 217)',
    grayDarker: 'rgb(110, 114, 125)',
    grayLight: 'rgb(237, 238, 242)',
    grayLighter: 'rgb(242, 244, 247)',
    primary: 'rgb(207, 0, 99)',
    primaryDarker: 'rgb(181, 0, 87)',
    primaryLighter: 'rgb(232, 0, 111)',
    white: '#ffffff',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    xxl: '28px',
  },
  fontWeight: {
    bold: 500,
    light: 300,
    normal: 400,
  },
  transition: '.12s ease-in-out',
};
