import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { HomePage } from './views/HomePage/HomePage';
import { InstructorsList } from './views/Instructors/InstructorsList/InstructorsList';
import { InstructorsDetails } from './views/Instructors/InstructorsDetails/InstructorsDetails';
import { InstructorsEdit } from './views/Instructors/InstructorsEdit/InstructorsEdit';
import { Layout } from './views/Layout/Layout';
import { Login } from './views/Login/Login';
import { TraineeDetails } from './views/Trainees/TraineeDetails/TraineeDetails';
import { TraineesList } from './views/Trainees/TraineesList/TraineesList';
import { VehicleDetails } from './views/Vehicles/VehicleDetails/VehicleDetails';
import { VehicleEdit } from './views/Vehicles/VehiclesEdit/VehiclesEdit';
import { VehiclesList } from './views/Vehicles/VehiclesList/VehiclesList';
import { VehicleNew } from './views/Vehicles/VehiclesNew/VehiclesNew';
import { InstructorsNew } from './views/Instructors/InstructorsNew/InstructorsNew';

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
        <Route path="/instruktorzy">
          <Route index element={<InstructorsList />} />
          <Route path="nowy" element={<InstructorsNew />} />
          <Route path=":instructorId/edytuj" element={<InstructorsEdit />} />
          <Route path=":instructorId" element={<InstructorsDetails />} />
        </Route>
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
