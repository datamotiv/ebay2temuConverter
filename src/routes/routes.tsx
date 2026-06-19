import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ForgetPassword from "../pages/forgetPassword";	
import SetNewPassword from "../pages/SetNewPassword";
import UserManagement from "../pages/UserManagement";
import Verification from "../components/Verification";
import { createBrowserRouter } from "react-router-dom";
import EbaySearchReport from "../pages/EbaySearchReport";
import EbaySearchHistory from "../pages/EbaySearchHistory";
import CategoryDetails from "../components/CategoryDetails";
import SalesInsights from "../pages/SalesInsights";
import RegisterEbay from "../pages/RegisterEbay";
import CommunicationHub from "../pages/CommunicationHub";
import ListingOp from "../pages/ListingOp";
import FitmentAdoptionSummary from "../pages/FitmentAdoptionSummary";
import PriceList from "../pages/PriceList";
import StripeReturnPage from "../components/StripeReturnPage";
import ListingOptimizationSummary from "../pages/ListingOptimizationSummary";
import ListingOptimizationCategoryDetails from "../components/ListingOptimizationCategoryDetails";
import DashboardShopify from "../pages/DashboardShopify";
import DashboardTemu from "../pages/DashboardTemu";
import DashboardAllegro from "../pages/DashboardAllegro";
import LinkYourStore from "../pages/LinkYourStore";
import PaymentSuccessPage from "../components/PaymentSuccessPage";
import MigrateEbayToTemu from "../pages/MigrationEbayToTemu";
import MigrationListingPage from "../pages/MigrationListingPage";
import AuthCallback from "../Redux/features/authCallbackTemu";
import MigrationDetailsPage from "../pages/MigrationDetailsPage";
import MigrationJobDetails from "../pages/MigrationJobDetails";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
	{
		path: "/stripeReturn",
		element: <StripeReturnPage />
	},
	{
		path: '/',
		element: <Register />
	  },
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/error",
		element: <ErrorPage />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/forget-password",
		element: <ForgetPassword />,
	},
	{
		path: "/verification",
		element: <Verification />,
	},
	{
		path: "/set-new-password",
		element: <SetNewPassword />,
	},

	{
		path: "/",
		element: <App />,
		children: [
			
			{
				path: "/dashboard",
				element: (
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard-shopify",
				element: (
					<PrivateRoute>
						<DashboardShopify />
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard-temu",
				element: (
					<PrivateRoute>
						<DashboardTemu />
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard-allegro",
				element: (
					<PrivateRoute>
						<DashboardAllegro />
					</PrivateRoute>
				),
			},
			{
				path: "/category-details/:id/:categoryId/:site",
				element: (
					<PrivateRoute>
						<CategoryDetails />
					</PrivateRoute>
				),
			},
			{
				path: "/listing-category-details/:id/:categoryId/:site",
				element: (
					<PrivateRoute>
						<ListingOptimizationCategoryDetails />
					</PrivateRoute>
				),
			},
			{
				path: "/migration-listing-page/:id/:categoryId/:site",
				element: (
					<PrivateRoute>
				<MigrationListingPage />
					</PrivateRoute>
				),
			},
			{
				path: "/profile",
				element: (
					<PrivateRoute>
						<EditProfile />
					</PrivateRoute>
				),
			},
			{
				path: "/ebay-search-report/:id",
				element: (
					<PrivateRoute>
						<EbaySearchReport />
					</PrivateRoute>
				),
			},
			{
				path: "/ebay-search-history",
				element: (
					<PrivateRoute>
						<EbaySearchHistory />
					</PrivateRoute>
				),
			},
			{
				path: "/user-management",
				element: (
					<PrivateRoute>
						<UserManagement />
					</PrivateRoute>
				),
			},
			{
				path: "/link-your-store",
				element: (
					<PrivateRoute>
						<LinkYourStore />
					</PrivateRoute>
				),
			},
			{
				path: "/payment-success-page",
				element: (
					<PrivateRoute>
						<PaymentSuccessPage />
					</PrivateRoute>
				),
			},
			{
				path: "/sales-insight",
				element: <SalesInsights />
			},
			{
				path: "/register-ebay",
				element: <RegisterEbay />
			},
			{
				path: "/communicationHub",
				element: <CommunicationHub />
			},
			{
				path: "/listingOp",
				element: <ListingOp />
			},
			{
				path: "/fitmentAdoptionSummary",
				element: <FitmentAdoptionSummary />
			},
			{
				path:"/listingOptimizationSummary",
				element: <ListingOptimizationSummary />
			},
			{
				path: "/priceList",
				element: <PriceList />
			},
			{
				path:'/migrationEbayToTemu',
				element: <MigrateEbayToTemu />
			},
			{
  path: "/migration-details/:migrationId",
  element: <MigrationDetailsPage />,
},
{
  path: "/migration-job-details",
  element: <MigrationJobDetails />,
}

			// {
			// 	path: "/stripeReturn",
			// 	element: <StripeReturnPage />
			// }

		],
	},
	{
		path: "/stripeReturn",
		element: <StripeReturnPage />
	},
	// {
	// 	path:'/landingPage',
	// 	element: <LandingPage />
	// },
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/forget-password",
		element: <ForgetPassword />,
	},
	{
		path: "/verification",
		element: <Verification />,
	},
	{
		path: "/set-new-password",
		element: <SetNewPassword />,
	},
	{
		path: "/sales-insight",
		element: <SalesInsights />
	},
	{
  path: "/auth/callback",
  element: <AuthCallback />,
}
]);

export default router;
