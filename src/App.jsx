import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./components/RouteGuards";
import SignIn from "./pages/AuthPages/SignIn";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import SignUp from "./pages/AuthPages/SignUp";
import PersonalInfo from "./pages/AuthPages/PersonalInfo";
import OTPVerfication from "./pages/AuthPages/OTPVerfication";
import Home from "./pages/Dashboard/Home";
import OngoingCases from "./pages/OngoingCases/Index";
import CaseDetailPage from "./pages/OngoingCases/CaseDetailPage";
import ProviderPage from "./pages/Providers/ProviderPage";
import UserProfile from "./pages/Settings/Profile/UserProfile";
import IntakeSetting from "./pages/Settings/Preferences/IntakeSetting";
import UpdatePassword from "./pages/Settings/Password/UpdatePassword";
import Payment from "./pages/Settings/Payments/Payment";
import { Archive } from "./pages/Archive/Index";
import LienResolution from "./pages/LienResolution/Index";
import CaseDashboard from "./pages/LienResolution/CaseDashboard";
import CreateDocumentPage from "./pages/Settings/Documents/CreateDocumentPage";
import MyDocuments from "./pages/Settings/Documents/MyDocuments";
import SignDocumentPage from "./pages/Settings/Documents/SignDocumentPage";
import PublicTaskForm from "./pages/PublicTask/PublicTaskForm";
import TwilioSettings from "./pages/Settings/Twilio/TwilioSettings";
import AssistantSettings from "./pages/Settings/Vapi/AssistantSettings";
import Campaigns from "./pages/Settings/Campaigns/Campaigns";

const NotFound = () => <h1>404: Page Not Found</h1>;

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/personal-info"
          element={
            <PublicRoute>
              <PersonalInfo />
            </PublicRoute>
          }
        />
        <Route
          path="/otp-verification"
          element={
            <PublicRoute>
              <OTPVerfication />
            </PublicRoute>
          }
        />
        <Route
          path="/tasks/:caseId"
          element={
            <PublicRoute noRedirect={true}>
              <PublicTaskForm />
            </PublicRoute>
          }
        />

        {/* Private Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/ongoing-cases"
          element={
            <PrivateRoute>
              <OngoingCases />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases-detail/:id"
          element={
            <PrivateRoute>
              <CaseDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/providers"
          element={
            <PrivateRoute>
              <ProviderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/password"
          element={
            <PrivateRoute>
              <UpdatePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/intake-setting"
          element={
            <PrivateRoute>
              <IntakeSetting />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/create-documents"
          element={
            <PrivateRoute>
              <CreateDocumentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/sign-documents"
          element={
            <PrivateRoute>
              <SignDocumentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/my-documents"
          element={
            <PrivateRoute>
              <MyDocuments />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/twilio"
          element={
            <PrivateRoute>
              <TwilioSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/vapi-assistant"
          element={
            <PrivateRoute>
              <AssistantSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/campaigns"
          element={
            <PrivateRoute>
              <Campaigns />
            </PrivateRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <PrivateRoute>
              <Archive />
            </PrivateRoute>
          }
        />
        <Route
          path="/lien-resolution"
          element={
            <PrivateRoute>
              <LienResolution />
            </PrivateRoute>
          }
        />
        <Route
          path="/case-dashboard/:case-id"
          element={
            <PrivateRoute>
              <CaseDashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
