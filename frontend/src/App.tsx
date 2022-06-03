import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { HomePage } from './views/HomePage/HomePage';
import { InstructorsList } from './views/InstructorsList/InstructorsList';
import { Layout } from './views/Layout/Layout';
import { Login } from './views/Login/Login';
import { TraineeDetails } from './views/Trainees/TraineeDetails/TraineeDetails';
import { TraineesList } from './views/Trainees/TraineesList/TraineesList';
import { VehicleDetails } from './views/Vehicles/VehicleDetails/VehicleDetails';
import { VehicleEdit } from './views/Vehicles/VehiclesEdit/VehiclesEdit';
import { VehiclesList } from './views/Vehicles/VehiclesList/VehiclesList';

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Layout>
            <RequireAuth />
          </Layout>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="/kursanci">
          <Route index element={<TraineesList />} />
          <Route path=":traineeId" element={<TraineeDetails />} />
        </Route>
        <Route path="/instruktorzy" element={<InstructorsList />} />
        <Route path="/pojazdy">
          <Route index element={<VehiclesList />} />
          <Route path=":vehicleId/edit" element={<VehicleEdit />} />
          <Route path=":vehicleId" element={<VehicleDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};
