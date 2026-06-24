import { createBrowserRouter, Navigate } from 'react-router-dom';
import StripeReturnPage from '../components/StripeReturnPage';
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

const router = createBrowserRouter([
  {
    path: '/stripeReturn',
    element: <StripeReturnPage />,
  },
  {
    path: '/migrate/success',
    element: <MigrateSuccessPage />,
  },
  {
    path: '/migrate/pay',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/error',
    element: <ErrorPage />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />,
  },
  {
    path: '/verification',
    element: <Verification />,
  },
  {
    path: '/set-new-password',
    element: <SetNewPassword />,
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

  // 	{
  // 		path: "/",
  // 		element: <App />,
  // 		children: [
  // 			{
  // 				path: "/dashboard-shopify",
  // 				element: (
  // 					<PrivateRoute>
  // 						<DashboardShopify />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/dashboard-temu",
  // 				element: (
  // 					<PrivateRoute>
  // 						<DashboardTemu />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/dashboard-allegro",
  // 				element: (
  // 					<PrivateRoute>
  // 						<DashboardAllegro />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/category-details/:id/:categoryId/:site",
  // 				element: (
  // 					<PrivateRoute>
  // 						<CategoryDetails />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/listing-category-details/:id/:categoryId/:site",
  // 				element: (
  // 					<PrivateRoute>
  // 						<ListingOptimizationCategoryDetails />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/migration-listing-page/:id/:categoryId/:site",
  // 				element: (
  // 					<PrivateRoute>
  // 				<MigrationListingPage />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/profile",
  // 				element: (
  // 					<PrivateRoute>
  // 						<EditProfile />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/ebay-search-report/:id",
  // 				element: (
  // 					<PrivateRoute>
  // 						<EbaySearchReport />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/ebay-search-history",
  // 				element: (
  // 					<PrivateRoute>
  // 						<EbaySearchHistory />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/user-management",
  // 				element: (
  // 					<PrivateRoute>
  // 						<UserManagement />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/link-your-store",
  // 				element: (
  // 					<PrivateRoute>
  // 						<LinkYourStore />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/payment-success-page",
  // 				element: (
  // 					<PrivateRoute>
  // 						<PaymentSuccessPage />
  // 					</PrivateRoute>
  // 				),
  // 			},
  // 			{
  // 				path: "/sales-insight",
  // 				element: <SalesInsights />
  // 			},
  // 			{
  // 				path: "/register-ebay",
  // 				element: <RegisterEbay />
  // 			},
  // 			{
  // 				path: "/communicationHub",
  // 				element: <CommunicationHub />
  // 			},
  // 			{
  // 				path: "/listingOp",
  // 				element: <ListingOp />
  // 			},
  // 			{
  // 				path: "/fitmentAdoptionSummary",
  // 				element: <FitmentAdoptionSummary />
  // 			},
  // 			{
  // 				path:"/listingOptimizationSummary",
  // 				element: <ListingOptimizationSummary />
  // 			},
  // 			{
  // 				path: "/priceList",
  // 				element: <PriceList />
  // 			},
  // 			{
  // 				path:'/migrationEbayToTemu',
  // 				element: <MigrateEbayToTemu />
  // 			},
  // 			{
  //   path: "/migration-details/:migrationId",
  //   element: <MigrationDetailsPage />,
  // },
  // {
  //   path: "/migration-job-details",
  //   element: <MigrationJobDetails />,
  // }

  // 			// {
  // 			// 	path: "/stripeReturn",
  // 			// 	element: <StripeReturnPage />
  // 			// }

  // 		],
  // 	},
  {
    path: '/stripeReturn',
    element: <StripeReturnPage />,
  },
  // {
  // 	path:'/landingPage',
  // 	element: <LandingPage />
  // },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />,
  },
  {
    path: '/verification',
    element: <Verification />,
  },
  {
    path: '/set-new-password',
    element: <SetNewPassword />,
  },
  {
    path: '/sales-insight',
    element: <SalesInsights />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
