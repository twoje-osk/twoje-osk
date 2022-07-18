import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { HomePage } from './views/HomePage/HomePage';
import { InstructorsList } from './views/Instructors/InstructorsList/InstructorsList';
import { Layout } from './views/Layout/Layout';
import { Login } from './views/Login/Login';
import { TraineeDetails } from './views/Trainees/TraineeDetails/TraineeDetails';
import { TraineeEdit } from './views/Trainees/TraineeEdit/TraineeEdit';
import { TraineeNew } from './views/Trainees/TraineeNew/TraineeNew';
import { TraineesList } from './views/Trainees/TraineesList/TraineesList';
import { VehicleDetails } from './views/Vehicles/VehicleDetails/VehicleDetails';
import { VehicleEdit } from './views/Vehicles/VehiclesEdit/VehiclesEdit';
import { VehiclesList } from './views/Vehicles/VehiclesList/VehiclesList';
import { VehicleNew } from './views/Vehicles/VehiclesNew/VehiclesNew';

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
          <Route path="nowy" element={<TraineeNew />} />
          <Route path=":traineeId" element={<TraineeDetails />} />
          <Route path=":traineeId/edytuj" element={<TraineeEdit />} />
        </Route>
        <Route path="/instruktorzy" element={<InstructorsList />} />
        <Route path="/pojazdy">
          <Route index element={<VehiclesList />} />
          <Route path="nowy" element={<VehicleNew />} />
          <Route path=":vehicleId/edytuj" element={<VehicleEdit />} />
          <Route path=":vehicleId" element={<VehicleDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};
