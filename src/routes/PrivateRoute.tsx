import { useAppSelector } from "../Redux/hooks";
import { Navigate, useLocation } from "react-router";

type TChildrenProps = {
	children: React.ReactNode;
};

const PrivateRoute = ({ children }: TChildrenProps) => {
	const location = useLocation();

	const user = useAppSelector((state) => state.auth.user);
	const accessToken = localStorage.getItem("accessToken");
	if (user || accessToken) {
		return <>{children}</>;
	}

	return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
