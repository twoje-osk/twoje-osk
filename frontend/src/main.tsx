import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthContextProviderWrapper } from './components/AuthContext/AuthContext';

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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthContextProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
