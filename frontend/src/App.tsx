import { UserRole } from '@osk/shared/src/types/user.types';
import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { RequireRole } from './components/RequireRole/RequireRole';
import { HomePage } from './views/HomePage/HomePage';
import { InstructorsList } from './views/Instructors/InstructorsList/InstructorsList';
import { Layout } from './views/Layout/Layout';
import { MyLessons } from './views/Lessons/MyLessons/MyLessons';
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
        <Route path="/kursanci" element={<RequireRole role={UserRole.Admin} />}>
          <Route index element={<TraineesList />} />
          <Route path="nowy" element={<TraineeNew />} />
          <Route path=":traineeId" element={<TraineeDetails />} />
          <Route path=":traineeId/edytuj" element={<TraineeEdit />} />
        </Route>
        <Route
          path="/instruktorzy"
          element={<RequireRole role={UserRole.Admin} />}
        >
          <Route index element={<InstructorsList />} />
        </Route>
        <Route path="/pojazdy" element={<RequireRole role={UserRole.Admin} />}>
          <Route index element={<VehiclesList />} />
          <Route path="nowy" element={<VehicleNew />} />
          <Route path=":vehicleId/edytuj" element={<VehicleEdit />} />
          <Route path=":vehicleId" element={<VehicleDetails />} />
        </Route>
        <Route
          path="/moje-jazdy"
          element={<RequireRole role={UserRole.Trainee} />}
        >
          <Route index element={<MyLessons />} />
        </Route>
      </Route>
    </Routes>
  );
};
