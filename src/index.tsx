import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@emotion/react';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './theme';
import { UniswapProvider } from './context/UniswapContext';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <UniswapProvider>
          <App />
        </UniswapProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
