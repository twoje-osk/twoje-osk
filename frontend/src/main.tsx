import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthContextProviderWrapper } from './components/AuthContext/AuthContext';
import { SWRConfigWithAuth } from './components/SWRConfigWithAuth/SWRConfigWithAuth';

const theme = createTheme({
  palette: {
    background: {
      default: blueGrey['50'],
    },
  },
});

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
