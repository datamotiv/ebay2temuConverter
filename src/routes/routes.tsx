import { createBrowserRouter, Navigate } from 'react-router-dom';
import MigrateSuccessPage from '../pages/MigrateSuccessPage';
import Verification from '../components/Verification';
import Dashboard from '../pages/Dashboard';
import Documentation from '../pages/Documentation';
import Settings from '../pages/Settings';
import ErrorPage from '../pages/ErrorPage';
import ForgetPassword from '../pages/forgetPassword';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import SalesInsights from '../pages/SalesInsights';
import SetNewPassword from '../pages/SetNewPassword';
import VerifyEmail from '../pages/VerifyEmail';
import AuthCallback from '../Redux/features/authCallbackTemu';
import PrivateRoute from './PrivateRoute';
import BillingPage from '../pages/BillingPage';
import OnboardingPage from '../pages/Onboarding/OnboardingPage';

const router = createBrowserRouter([
  // ── Public auth ──────────────────────────────────────────────────────────
  { path: '/', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/forget-password', element: <ForgetPassword /> },
  { path: '/set-new-password', element: <SetNewPassword /> },
  { path: '/verification', element: <Verification /> },

  // ── OAuth callbacks ───────────────────────────────────────────────────────
  { path: '/auth/callback', element: <AuthCallback /> },

  // ── Stripe payment callbacks ──────────────────────────────────────────────
  { path: '/migrate/success', element: <MigrateSuccessPage /> },
  { path: '/migrate/pay', element: <Navigate to="/dashboard" replace /> },

  // ── Misc public ──────────────────────────────────────────────────────────
  { path: '/sales-insight', element: <SalesInsights /> },
  { path: '/error', element: <ErrorPage /> },

  // ── Protected ────────────────────────────────────────────────────────────
  {
    path: '/onboarding',
    element: (
      <PrivateRoute>
        <OnboardingPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/documentation',
    element: (
      <PrivateRoute>
        <Documentation />
      </PrivateRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  {
    path: '/billing',
    element: (
      <PrivateRoute>
        <BillingPage />
      </PrivateRoute>
    ),
  },

  { path: '*', element: <NotFound /> },
]);

export default router;
