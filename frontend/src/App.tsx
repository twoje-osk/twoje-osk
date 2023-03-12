import { UserRole } from '@osk/shared/src/types/user.types';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { RequireRole } from './components/RequireRole/RequireRole';
import { ForgotPassword } from './views/ForgotPassword/ForgotPassword';
import { HomePage } from './views/HomePage/HomePage';
import { InstructorsList } from './views/Instructors/InstructorsList/InstructorsList';
import { InstructorsDetails } from './views/Instructors/InstructorsDetails/InstructorsDetails';
import { InstructorsEdit } from './views/Instructors/InstructorsEdit/InstructorsEdit';
import { MyLessons } from './views/Lessons/MyLessons/MyLessons';
import { Login } from './views/Login/Login';
import { ResetPassword } from './views/ResetPassword/ResetPassword';
import { TraineeDetails } from './views/Trainees/TraineeDetails/TraineeDetails';
import { TraineeEdit } from './views/Trainees/TraineeEdit/TraineeEdit';
import { TraineeNew } from './views/Trainees/TraineeNew/TraineeNew';
import { TraineesList } from './views/Trainees/TraineesList/TraineesList';
import { VehicleDetails } from './views/Vehicles/VehicleDetails/VehicleDetails';
import { VehicleEdit } from './views/Vehicles/VehiclesEdit/VehiclesEdit';
import { VehiclesList } from './views/Vehicles/VehiclesList/VehiclesList';
import { VehicleNew } from './views/Vehicles/VehiclesNew/VehiclesNew';
import { InstructorsNew } from './views/Instructors/InstructorsNew/InstructorsNew';
import { AnnouncementsList } from './views/Announcements/AnnouncementsList';
import { Availability } from './views/Availability/Availability';
import { DefaultAvailability } from './views/DefaultAvailability/DefaultAvailability';
import { SignUp } from './views/SignUp/SignUp';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { MyProfile } from './views/MyProfile/MyProfile';

export const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/zapisz-sie" element={<SignUp />} />
        <Route path="/account/zapomnialem-haslo" element={<ForgotPassword />} />
        <Route path="/account/reset">
          <Route index element={<Navigate to="/account/zapomnialem-haslo" />} />
          <Route path=":token" element={<ResetPassword />} />
        </Route>
        <Route path="/" element={<RequireAuth />}>
          <Route index element={<HomePage />} />
          <Route
            path="/kursanci"
            element={
              <RequireRole roles={[UserRole.Admin, UserRole.Instructor]} />
            }
          >
            <Route index element={<TraineesList />} />
            <Route path="nowy" element={<TraineeNew />} />
            <Route path=":traineeId" element={<TraineeDetails />} />
            <Route path=":traineeId/edytuj" element={<TraineeEdit />} />
          </Route>
          <Route
            path="/instruktorzy"
            element={
              <RequireRole roles={[UserRole.Admin, UserRole.Instructor]} />
            }
          >
            <Route index element={<InstructorsList />} />
            <Route path="nowy" element={<InstructorsNew />} />
            <Route path=":instructorId/edytuj" element={<InstructorsEdit />} />
            <Route path=":instructorId" element={<InstructorsDetails />} />
          </Route>
          <Route
            path="/pojazdy"
            element={
              <RequireRole roles={[UserRole.Admin, UserRole.Instructor]} />
            }
          >
            <Route index element={<VehiclesList />} />
            <Route path="nowy" element={<VehicleNew />} />
            <Route path=":vehicleId/edytuj" element={<VehicleEdit />} />
            <Route path=":vehicleId" element={<VehicleDetails />} />
          </Route>
          <Route
            path="/ogloszenia"
            element={
              <RequireRole
                roles={[UserRole.Admin, UserRole.Instructor, UserRole.Trainee]}
              />
            }
          >
            <Route index element={<AnnouncementsList />} />
          </Route>
          <Route
            path="/moje-jazdy"
            element={
              <RequireRole roles={[UserRole.Trainee, UserRole.Instructor]} />
            }
          >
            <Route index element={<MyLessons />} />
          </Route>
          <Route
            path="/moja-dostepnosc"
            element={<RequireRole role={UserRole.Instructor} />}
          >
            <Route index element={<Availability />} />
            <Route path="domyslna" element={<DefaultAvailability />} />
          </Route>
          <Route
            path="/ogloszenia"
            element={
              <RequireRole roles={[UserRole.Trainee, UserRole.Instructor]} />
            }
          >
            <Route index element={null} />
          </Route>
          <Route path="/profil">
            <Route index element={<MyProfile />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};
