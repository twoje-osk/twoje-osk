import {
  Container,
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Flex } from 'reflexbox';
import { Layout } from '../Layout/Layout';

export const InstructorsList = () => {
  const pageTitle = 'Instruktorzy';
  const rows = [
    {
      name: 'Adam Abacki',
      email: 'adam.abacki@gmail.com',
      phone: '512345678',
      car: '1',
    },
    {
      name: 'Badam Babacki',
      email: 'badam.babacki@gmail.com',
      phone: '523456789',
      car: '3',
    },
    {
      name: 'Cadam Cadacki',
      email: 'adam.abacki@gmail.com',
      phone: '534567890',
      car: '4',
    },
    {
      name: 'Dadam Dabacki',
      email: 'adam.abacki@gmail.com',
      phone: '561234567',
      car: '2',
    },
    {
      name: 'Adam Abacki',
      email: 'adam.abacki@gmail.com',
      phone: '512345678',
      car: '1',
    },
    {
      name: 'Badam Babacki',
      email: 'badam.babacki@gmail.com',
      phone: '523456789',
      car: '3',
    },
    {
      name: 'Cadam Cadacki',
      email: 'adam.abacki@gmail.com',
      phone: '534567890',
      car: '4',
    },
    {
      name: 'Dadam Dabacki',
      email: 'adam.abacki@gmail.com',
      phone: '561234567',
      car: '2',
    },
  ];

  return (
    <Layout>
      <Container component="main" sx={{ width: '80%' }}>
        <Flex width="100%" alignItems="center">
          <Paper sx={{ width: '90%', margin: 'auto' }} elevation={2}>
            <Box p="2rem">
              <Typography variant="h5" component="h1">
                {pageTitle}
              </Typography>
            </Box>
            <Flex justifyContent="center" mb="1.5rem">
              <Table sx={{ maxWidth: '90%' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Imię i nazwisko</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Telefon</TableCell>
                    <TableCell align="right">Samochód</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.phone}</TableCell>
                      <TableCell align="right">{row.car}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Flex>
          </Paper>
        </Flex>
      </Container>
    </Layout>
  );
};
