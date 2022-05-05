import {
  Button,
  Container,
  Icon,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Flex } from 'reflexbox';

export function Login() {
  const oskName = 'OSK Adam Nowak';

  return (
    <Container component="main" maxWidth="sm">
      <Flex width="100%" height="100vh" alignItems="center">
        <Paper sx={{ width: '100%' }} elevation={2}>
          <Box p="2rem">
            <Flex justifyContent="center" alignItems="center">
              <Flex mr="1rem">
                <Icon sx={{ fontSize: 48 }}>car_rental</Icon>
              </Flex>
              <Typography variant="h3" component="h1">
                {oskName}
              </Typography>
            </Flex>
            <Flex as="form" flexDirection="column" mt="0.25rem">
              <TextField id="email" label="Email" margin="normal" />
              <TextField
                id="password"
                label="Hasło"
                type="password"
                margin="normal"
              />
              <Flex justifyContent="space-between" mt="1rem">
                <Button variant="contained" type="submit">
                  Zaloguj Się
                </Button>
                <Button variant="outlined" type="button">
                  Zapisz Się na Kurs
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Paper>
      </Flex>
    </Container>
  );
}
