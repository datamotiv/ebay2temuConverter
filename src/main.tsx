import "./index.css";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import router from "./routes/routes.tsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '@fontsource/poppins';


//working code
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
			<Toaster />
		</Provider>
	</StrictMode>
);

//use this code if website is under maintainence
// const isMaintenance = true;

// const MaintenanceBanner = () => (
// 	<div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 text-center px-4">
//     <h1 className="text-4xl font-bold text-red-600 mb-4">🚧 We'll Be Right Back</h1>
//     <p className="text-lg text-gray-700 max-w-md">
//       We’re making some quick updates to improve your experience.
//       The site will be back shortly. Thank you for your patience!
//     </p>
//   </div>
// );

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <Provider store={store}>
//       {isMaintenance ? (
//         <MaintenanceBanner />
//       ) : (
//         <>
//           <RouterProvider router={router} />
//           <Toaster />
//         </>
//       )}
//     </Provider>
//   </StrictMode>
// );
