import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Token } from '../TokenDropdown/tokenList';
import { LoadingSpinner } from '..';

const Footer = styled.footer`
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  margin-bottom: 8px;
  min-height: 40px;
  padding: 4px 8px;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayLighter};
  }

  span {
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }
`;

type SwapFooterProps = {
  fromToken: Token;
  toToken: Token;
  prices?: {
    fromToken: number;
    toToken: number;
  };
  loading: boolean;
};

export const SwapFooter: FC<SwapFooterProps> = ({ fromToken, prices, toToken, loading }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const renderPrices = () => {
    if (!prices) return '';

    if (isFlipped) {
      return `1 ${toToken.symbol} = ${prices.toToken.toFixed(4)} ${fromToken.symbol}`;
    } else {
      return `1 ${fromToken.symbol} = ${prices.fromToken.toFixed(4)} ${toToken.symbol}`;
    }
  };

  return (
    <Footer onClick={() => setIsFlipped(!isFlipped)}>
      {loading ? <LoadingSpinner size="sm" text="Fetching updated prices." /> : <span>{renderPrices()}</span>}
    </Footer>
  );
};
