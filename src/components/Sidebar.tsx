import {  NavLink, useNavigate } from "react-router-dom";
import { dashboardItems } from "../utils/data";
import LogoutIcon from "../assets/icons/LogoutIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { signout } from "../Redux/features/auth/authSlice";
import carImage from "../assets/images/car.jpg";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { resetState as resetPaymentModal} from "../Redux/features/paymentModalSlice";
import { resetState as resetRegisterSellerModal} from "../Redux/features/registerSellerModalSlice";
import { resetState as resetFitmentScoreSlice} from "../Redux/features/fitmentScoreSlice";
import { resetState as resetAuthSlice} from "../Redux/features/auth/authSlice";
import { apiSlice } from "../Redux/api/apiSlice";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signout());
    dispatch(resetAuthSlice());
    dispatch(resetPaymentModal());
    dispatch(resetFitmentScoreSlice());
    dispatch(resetRegisterSellerModal());
    dispatch(apiSlice.util.resetApiState()); // Reset API cache
    navigate("/login"); // Redirect to login page after logout
  };

  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div
    style={{ backgroundImage:  `url(${carImage})`, backgroundSize: "cover", backgroundRepeat:'no-repeat', backgroundPosition: "center"}}
    className="flex flex-col justify-between h-screen bg-secondary sticky top-0 left-0 overflow-x-hidden overflow-y-hidden min-h-screen">
       <div className="absolute inset-0 bg-black opacity-70"></div>

       {/* <div className="absolute top-4 left-0 right-0 flex justify-center">
    <span className="bg-[#F4D06F] text-black text-[12px] font-bold px-2 py-1 rounded-full">
      Beta Version
    </span>
  </div> */}
      
       <div className="relative z-10 top-[4rem]">      <div className="">
        {/* <div className="px-4 my-10 flex gap-2">
          <Link to="/" className="text-xl font-poppins font-medium text-white">
            e-motiv
          </Link>
             <img src={emotivLogo} width={120} alt="logo" color="white" />
             <DashboardRoundedIcon style={{color:'white', fontSize:'25px'}} />
             <h4 className="text-center text-lg text-white font-bold">Dashboard</h4>
        </div> */}
        {/* <div className="space-y-2">
          {dashboardItems.map(
            ({ id, url, icon: Icon, label, tooltip ,children }: TDashboardItems) => (
             
              <NavLink
                key={id}
                to={url}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-5 py-4 text-white hover:bg-primary ${
                    isActive ? "bg-primary" : ""
                  } duration-500`
                }
                onClick={(e) => {
                  if (children) {
                    e.preventDefault(); // Prevent navigation when submenu exists
                    toggleMenu(id);
                  }
                }}
              >
                 <Tooltip title={tooltip || ""}>
                <Icon />{" "}
                <span className="text-sm font-poppins font-medium">
                  {label}
                </span>
                </Tooltip>
                            {children && <span>{openMenus[id] ? "▲" : "▼"}</span>}

              </NavLink>
             
            )
          )}
        </div> */}
        <div className="space-y-3 mb-10">
        {dashboardItems.map(({ id, url, icon: Icon, label, tooltip, children }) => (
  <div key={id}>
    {url.startsWith("http") ? (
      // Open external links (e.g., eBay registration) in a new tab
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-1 px-5 py-4 text-white hover:bg-primary duration-500"
      >
        <div className="flex items-center gap-1">
          {Icon && <Icon />}
          <Tooltip title={tooltip || ""}>
            <span className="text-sm font-poppins font-medium">{label}</span>
          </Tooltip>
        </div>
      </a>
    ) : (
      // Use NavLink for internal routing
      <NavLink
        to={url}
        className={({ isActive }) =>
          `flex items-center justify-between gap-1 px-5 py-4 text-white hover:bg-primary ${
            isActive ? "bg-primary" : ""
          } duration-500`
        }
        onClick={(e) => {
          if (children) {
            e.preventDefault(); // Prevent navigation when submenu exists
            toggleMenu(id);
          }
        }}
      >
        <div className="flex items-center gap-1">
          {Icon && <Icon />}
          <Tooltip title={tooltip || ""}>
            <span className="text-sm font-poppins font-medium">{label}</span>
          </Tooltip>

          {label === "Dashboard" && (
      <span className="absolute top-1 right-2 bg-[#F4D06F] text-black text-[14px] font-bold px-2 py-[2px] rounded-full">
        BETA
      </span>
    )}
        </div>
        {children && <span>{openMenus[id] ? "▲" : "▼"}</span>}
      </NavLink>
    )}

    {/* Submenu Rendering */}
    {children && openMenus[id] && (
      <div className="ml-6 space-y-1">
        {children.map(({ id: childId, url, label, tooltip }) => (
          <NavLink
            key={childId}
            to={url}
            className=
            "flex items-center gap-1 px-5 py-3 text-white hover:bg-primary duration-500"
          >
            <Tooltip title={tooltip || ""}>
              <span className="text-sm font-poppins font-medium">{label}</span>
            </Tooltip>
          </NavLink>
        ))}
      </div>
    )}
  </div>
))}

    </div>
      </div>
      <div className="p-4 h-1/4">
        <div
          onClick={handleLogout}
          className="text-white flex items-center gap-1 bg-white/10 py-2.5 px-4 rounded-[5px]  cursor-pointer"
        >
          <LogoutIcon />
          <span className="text-sm font-poppins">Log Out</span>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Sidebar;
