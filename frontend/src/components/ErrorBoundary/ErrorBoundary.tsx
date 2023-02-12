/* eslint-disable react/destructuring-assignment */
import { Container, Paper } from '@mui/material';
import { Component } from 'react';
import { Flex } from 'reflexbox';
import { GeneralAPIError } from '../GeneralAPIError/GeneralAPIError';

interface ErrorBoundaryProps {
  children: JSX.Element;
}
interface ErrorBoundaryState {
  didThrow: boolean;
}
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // eslint-disable-next-line react/state-in-constructor
  public state: ErrorBoundaryState = {
    didThrow: false,
  };

  static getDerivedStateFromError() {
    return { didThrow: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
  }

  public render() {
    if (this.state.didThrow) {
      return (
        <Container component="main" maxWidth="sm">
          <Flex width="100%" height="100vh" alignItems="center">
            <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
              <GeneralAPIError />
            </Paper>
          </Flex>
        </Container>
      );
    }

    return this.props.children;
  }
}
