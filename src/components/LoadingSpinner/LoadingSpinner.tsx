import React, { FC } from 'react';
import styled from '@emotion/styled';

type SpinnerProps = {
  size: 'sm' | 'md';
};

const Spinner = styled.div<SpinnerProps>`
  display: inline-block;
  height: ${({ size }) => (size === 'sm' ? '20px' : '40px')};
  width: ${({ size }) => (size === 'sm' ? '20px' : '40px')};

  transform: translateY(${({ size }) => (size === 'sm' ? '-1.5px' : '-3px')});

  &:before {
    content: ' ';
    display: block;
    width: ${({ size }) => (size === 'sm' ? '16px' : '32px')};
    height: ${({ size }) => (size === 'sm' ? '16px' : '32px')};
    margin: ${({ size }) => (size === 'sm' ? '2px' : '4px')};
    border-radius: 50%;
    border: ${({ size }) => (size === 'sm' ? '1.5px' : '3px')} solid ${({ theme }) => theme.colors.grayDarker};
    border-color: ${({ theme }) => theme.colors.grayDarker} transparent ${({ theme }) => theme.colors.grayDarker} transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SpinnerText = styled.span`
  margin-left: 8px;
`;

type LoadingSpinnerProps = {
  style?: React.CSSProperties;
  size?: 'sm' | 'md';
  text?: string;
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'sm', style, text }) => (
  <>
    <Spinner size={size} style={style} />
    {text && <SpinnerText>{text}</SpinnerText>}
  </>
);
