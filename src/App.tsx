import React from 'react';
import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SwapContainer, WalletButton } from './components';
import logo from './assets/swapper-logo.png';
import github from './assets/github.png';

const Main = styled.main`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 70px);
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  min-height: 70px;
`;

const SwapperLogo = styled.img`
  border-radius: 50%;
  box-shadow: aliceblue 1px 0px 8px;
  max-width: 250px;
  margin-bottom: 30px;
  pointer-events: none;
`;

const Footer = styled.footer`
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  width: 100%;

  img {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    height: 40px;
    margin: 0 20px 20px 0;
    transition: ${({ theme }) => theme.transition};

    &:hover {
      transform: scale(1.2);
    }
  }
`;

function App() {
  return (
    <>
      <Header>
        <WalletButton />
      </Header>
      <Main>
        <SwapperLogo src={logo} alt="Swapper Logo" />
        <SwapContainer />
      </Main>
      <Footer>
        <a href="https://github.com/owinges/swapper" target="_blank" rel="noreferrer">
          <img src={github} alt="Check it out on Github" />
        </a>
      </Footer>
      <ToastContainer theme="colored" />
    </>
  );
}

export default App;
