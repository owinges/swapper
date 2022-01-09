import React, { FC, useRef, useState } from 'react';
import { useClickAway, useKey } from 'react-use';
import styled from '@emotion/styled';
import { Token } from './tokenList';

const Dropdown = styled.div`
  position: relative;
`;

const Header = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.grayLight};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: rgba(0, 0, 0, 0.075) 0px 6px 10px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  height: 2.4rem;
  margin-left: 12px;
  padding: 0px 8px;
  text-decoration: none;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ disabled, theme }) => (disabled ? theme.colors.grayLight : theme.colors.grayDark)};
  }

  img {
    border-radius: ${({ theme }) => theme.borderRadius.round};
    box-shadow: ${({ theme }) => theme.boxShadow.black};
    height: 24px;
    margin-right: 6px;
    width: 24px;
  }

  span {
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSize.xl};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }
`;

type ListProps = {
  show: boolean;
};

const ListContainer = styled.div<ListProps>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: ${(props) => (props.show ? 'block' : 'none')};
  height: 380px;
  left: 50%;
  width: 220px;
  padding: 20px 0;
  position: absolute;
  top: 2.8rem;
  transform: translateX(-50%);
`;

const List = styled.div`
  height: 340px;
  overflow-y: scroll;
`;

type OptionProps = {
  selected: boolean;
};

const Option = styled.button<OptionProps>`
  align-items: center;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.grayLight : 'transparent')};
  border: none;
  cursor: pointer;
  display: flex;
  padding: 4px 20px;
  text-align: start;
  width: 100%;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.grayLight};
    outline: none;
  }

  img {
    border-radius: ${({ theme }) => theme.borderRadius.round};
    box-shadow: ${({ theme }) => theme.boxShadow.black};
    height: 24px;
    margin-right: 12px;
    width: 24px;
  }

  div {
    display: flex;
    flex-direction: column;

    span {
      color: ${({ theme }) => theme.colors.grayDarker};
      font-weight: ${({ theme }) => theme.fontWeight.light};
      font-size: ${({ theme }) => theme.fontSize.xs};

      &:first-of-type {
        color: ${({ theme }) => theme.colors.black};
        font-weight: ${({ theme }) => theme.fontWeight.bold};
        font-size: ${({ theme }) => theme.fontSize.md};
      }
    }
  }
`;

type Props = {
  onSelect: (token: Token) => void;
  selectedToken?: Token;
  tokens: Token[];
  // Temporary prop; only as long as ETH/WETH is the only allowed "from" input token.
  disabled?: boolean;
};

export const TokenDropdown: FC<Props> = ({ onSelect, selectedToken, tokens, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const toggleOpen = () => {
    // Temporarily measure to disable changing the "from" token from ETH/WETH.
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelection = (token: Token) => {
    onSelect(token);
    setIsOpen(false);
  };

  const headerRef = useRef(null);
  const listContainerRef = useRef(null);

  useClickAway(listContainerRef, ({ target }) => {
    const targetIsHeader = target === headerRef.current || (target as HTMLElement).parentElement === headerRef.current;

    if (isOpen && !targetIsHeader) {
      toggleOpen();
    }
  });

  const listRef = useRef(null);

  useKey(
    ({ key }) => ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(key),
    (event) => {
      event.preventDefault();

      if (!isOpen) return;

      // Type this properly.
      const options = (listRef.current as unknown as HTMLDivElement).children as any;

      let newIndex = 0;

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        newIndex = focusedIndex === options.length - 1 ? options.length - 1 : focusedIndex + 1;
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        newIndex = focusedIndex === 0 ? 0 : focusedIndex - 1;
      }

      setFocusedIndex(newIndex);
      options[newIndex].focus();
    },
    { event: 'keydown' },
  );

  return (
    <Dropdown>
      <Header onClick={toggleOpen} ref={headerRef} disabled={disabled}>
        {selectedToken ? (
          <>
            <img src={selectedToken.logoURI} alt={`${selectedToken.name} logo`} />
            <span>{selectedToken.symbol}</span>
          </>
        ) : (
          <span>'Select a token'</span>
        )}
      </Header>
      <ListContainer show={isOpen} ref={listContainerRef}>
        <List ref={listRef}>
          {tokens.map((token) => {
            return (
              <Option key={token.address} onClick={() => handleSelection(token)} selected={token.address === selectedToken?.address}>
                <img src={token.logoURI} alt={`${token.name} logo`} />
                <div>
                  <span>{token.symbol}</span>
                  <span>{token.name}</span>
                </div>
              </Option>
            );
          })}
        </List>
      </ListContainer>
    </Dropdown>
  );
};
