import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthContextProviderWrapper } from './components/AuthContext/AuthContext';
import { SWRConfigWithAuth } from './components/SWRConfigWithAuth/SWRConfigWithAuth';
import { theme } from './theme';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProviderWrapper>
        <SWRConfigWithAuth>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </SWRConfigWithAuth>
      </AuthContextProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
