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
import { TraineePaymentsList } from './views/Trainees/TraineePayments/TraineePaymentsList/TraineePaymentsList';
import { PaymentsList } from './views/Payments/PaymentsList/PaymentsList';
import { PaymentDetails } from './views/Payments/PaymentDetails/PaymentDetails';
import { PaymentEdit } from './views/Payments/PaymentEdit/PaymentEdit';
import { TraineePaymentDetails } from './views/Trainees/TraineePayments/TraineePaymentDetails/TraineePaymentDetails';
import { TraineePaymentEdit } from './views/Trainees/TraineePayments/TraineePaymentEdit/TraineePaymentEdit';
import { PaymentNew } from './views/Payments/PaymentNew/PaymentNew';
import { TraineePaymentNew } from './views/Trainees/TraineePayments/TraineePaymentNew/TraineePaymentNew';
import { MyPaymentsList } from './views/MyPayments/MyPaymentsList/MyPaymentsList';
import { TraineeReport } from './views/Trainees/TraineeReport/TraineeReport';
import { InstructorFinishLesson } from './views/Lessons/InstructorMyLessons/InstructorFinishLesson/InstructorFinishLesson';
import { LecturesList } from './views/Lectures/LecturesList/LecturesList';
import { LectureDetails } from './views/Lectures/LectureDetails/LectureDetails';

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
            <Route
              path=":traineeId/platnosci"
              element={<RequireRole roles={[UserRole.Admin]} />}
            >
              <Route index element={<TraineePaymentsList />} />
              <Route path="nowa" element={<TraineePaymentNew />} />
              <Route path=":paymentId" element={<TraineePaymentDetails />} />
              <Route
                path=":paymentId/edytuj"
                element={<TraineePaymentEdit />}
              />
            </Route>
            <Route path=":traineeId/raport" element={<TraineeReport />} />
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
            <Route
              path=":lessonId/zakoncz"
              element={<InstructorFinishLesson />}
            />
            <Route path=":lessonId" element={<MyLessons />} />
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
          <Route
            path="/platnosci"
            element={<RequireRole roles={[UserRole.Admin]} />}
          >
            <Route index element={<PaymentsList />} />
            <Route path="nowa" element={<PaymentNew />} />
            <Route path=":paymentId" element={<PaymentDetails />} />
            <Route path=":paymentId/edytuj" element={<PaymentEdit />} />
          </Route>
          <Route
            path="/moje-platnosci"
            element={<RequireRole roles={[UserRole.Trainee]} />}
          >
            <Route index element={<MyPaymentsList />} />
            <Route path=":paymentId" element={<MyPaymentDetails />} />
          </Route>
          <Route
            path="/wyklady"
            element={<RequireRole roles={[UserRole.Trainee]} />}
          >
            <Route index element={<LecturesList />} />
            <Route path=":lectureId" element={<LectureDetails />} />
          </Route>
          <Route path="/profil">
            <Route index element={<MyProfile />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};
