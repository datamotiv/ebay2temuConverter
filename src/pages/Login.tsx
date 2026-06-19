/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import Input from "../components/input/Input";
import { useNavigate } from "react-router-dom";
import { useSigninMutation } from "../Redux/features/auth/authApi";
import { setAccessToken } from "../Redux/features/auth/authSlice";
import { useAppDispatch } from "../Redux/hooks";
import Register from "./Register";
import LoginPage from "../assets/images/LoginPage_cleanup.png";
import CloseIcon from "../assets/icons/CloseIcon";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ForgotPasswordModal from "./ForgotPasswordModal ";
import autofitPowered from "../assets/images/autofitpowered.png"
// import { connectTemu } from "../services/temuService";
// Modal.setAppElement('#root');

const customStyles = {
  overlay: {
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Optional, dark background behind modal
  },
  content: {
    zIndex: 1001,
    borderRadius: "10px",
    // padding: '20px',
    // height: '45rem',
    maxWidth: "75rem",
    margin: "auto",
    overflow: "hidden",
  },
};

interface Seller {
  userId: number;
  sellerName: string;
  email: string;
}

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSigninMutation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
  const [sellerList, setSellerList] = useState<Seller[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [loginResult, setLoginResult] = useState<any>(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // working code
  // const handleSubmit = async (e: React.FormEvent) => {

  //   e.preventDefault();

  //   if (!loginInfo.username) {
  //     toast.error("eMail can't be empty.");
  //     return;
  //   }

  //   if (!loginInfo.password) {
  //     toast.error("Password can't be empty.");
  //     return;
  //   }

  //   try {
  //     const result = await signIn(loginInfo).unwrap();
  //     console.log(result)
  //     if (result) {
  //       localStorage.setItem("userName", loginInfo.username);
  //       localStorage.setItem("isAdmin", JSON.stringify(result.admin));

  //       toast.success("Logged in successfully.");
  //       dispatch(setAccessToken(result));
  //       navigate("/"); // Redirect to dashboard or another page
  //     }
  //   } catch (err: any) {
  //     toast.error(err.message || "Login failed");
  //     // console.log(err.message || "Login failed");

  //   }
  // };

  //  new code
  const handleSubmit = async (e: React.FormEvent) => {
    // debugger;
    e.preventDefault();

    const { username, password } = loginInfo;
    if (!username) return toast.error("Email can't be empty.");
    if (!password) return toast.error("Password can't be empty.");

    try {
      let result = await signIn(loginInfo).unwrap();
      setLoginResult(result); 

      console.log("Login Result:", result);

      if (result.admin && !username.includes("/")) {
        const sellers = await fetchSellers(result.accessToken);
        if (sellers.length > 0) {
          setSellerList(sellers);

          setSellerDialogOpen(true);
        }
        localStorage.setItem("isAdmin", String(result.admin));
      }  else {
        handlePostLogin(username, result);
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      // console.log(err,'login fild')
    }
  };

//  const handleConnectTemu = async () => {
//   try {
//     const res: any = await connectTemu();

//     console.log("FULL RESPONSE:", res);

//     // 👇 TEMP SAFE CHECK
//     if (!res || !res.url) {
//       console.error("URL not found in response", res);
//       return;
//     }

//     window.location.href = res.authUrl;

//   } catch (error) {
//     console.error(error);
//   }
// };

  const handlePostLogin = (username: string, result: any) => {
    // debugger;
    localStorage.setItem("userName", username);
    localStorage.setItem("isAdmin", String(result.admin));
    dispatch(setAccessToken(result));
    toast.success("Logged in successfully.");
    navigate("/dashboard"); // Redirect to dashboard
  };

  const fetchSellers = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_KEY}/user/seller`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch sellers");
      return await response.json();
    } catch (error) {
      toast.error("Unable to fetch seller list.");
      return [];
    }
  };

  const handleSellerConfirm = async () => {
    // debugger;
    const selectedSellers = sellerList.find(
      (s) => s.userId === selectedUserIds
    );

    if (!selectedSellers) {
      toast.error("Please select a seller.");
      return;
    }

    try {
      const modifiedUsername = `${loginInfo.username}/${selectedSellers.userId}`;
      const result = await signIn({
        username: modifiedUsername,
        password: loginInfo.password,
      }).unwrap();

      setSellerDialogOpen(false);

      handlePostLogin(modifiedUsername, result);

      toast.success(`Logged in as ${selectedSellers.sellerName}`);
    } catch (error: any) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    setOpenResetPasswordModal(true); // This will open the ForgotPasswordModal
  };

  const handleAdminContinue = () => {
    // debugger;
  if (!loginInfo.username || !loginInfo.password) {
    toast.error("Missing login info.");
    return;
  }


  if (!loginResult) {
    toast.error("Session expired. Please login again.");
    navigate("/login");
    return;
  }

  handlePostLogin(loginInfo.username, loginResult);
  setSellerDialogOpen(false);
};


  return (
    <div
      style={{
        background: `url(${LoginPage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
      className="login-page-bg w-full h-screen flex items-center p-[50px] gap-[250px] justify-between bg-[#F3F3F3] relative overflow-hidden z-10"
    >
      <div className="absolute bottom-4 right-4 z-30 bottom-logo">
  <img
    src={autofitPowered}
    alt="bottomLogo"
    className="w-[400px] h-auto object-contain"
  />
</div>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
        }}
        className="login-form-box flex m-8 flex-col p-12 items-center justify-between  w-1/3 border-2 border-r-6"
      >
        {/* <Link to="/" className="text-black font-rajdhani text-[40px] font-bold">
          e-motiv
        </Link> */}

        <form 
        onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4">
            <h1 className="titleBG text-4xl font-bold">Login</h1>
            <h6 className="mb-0">
              Don't have an account?{" "}
              <button
                // to={"/register"}
                type="button"
                onClick={openModal}
                className="font-rajdhani text-blue-500 font-semibold"
              >
                Create your account
              </button>
              , It takes <br /> less than a minute{" "}
            </h6>

            <div>
              <Input
                id="username"
                name="username"
                placeholder="Email Address"
                value={loginInfo?.username}
                onChange={(newValue) =>
                  setLoginInfo({
                    ...loginInfo,
                    username: newValue,
                  })
                }
                type="text"
                className="p-2 w-full border-[#EE7178]"
              />
            </div>
            <div className="relative">
      <Input
        id="password"
        name="password"
        placeholder="Password"
        value={loginInfo.password}
        onChange={(newValue: string) =>
          setLoginInfo({
            ...loginInfo,
            password: newValue,
          })
        }
        type={showPassword ? "text" : "password"}
        className="p-2 w-full border-[#EE7178]"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon /> }
      </button>

 
</div>
<div className="text-right text-sm text-blue-500 underline cursor-pointer mt-1 mb-4">
  <button type="button" 
  onClick={handleForgotPassword}
  >
    Forgot password?
  </button>
    </div>

    
      {/* Forgot password modal */}
      <ForgotPasswordModal
        open={openResetPasswordModal}
        onClose={() => setOpenResetPasswordModal(false)}
      />

            <div>
              <div className="flex items-center mb-6 mt-6">
              
              </div>

              <button
                type="submit"
                className="bg-[#ED1F24] px-2 py-2  text-white rounded-[30px] min-w-[160px] font-rajdhani text-xl font-medium"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

  
            </div>
          </div>
        </form>
      </div>

    
      <div>
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          // contentLabel="Example Modal"
          style={customStyles}
        >
          <div className="flex flex-col items-end justify-center h-full">
            <button onClick={closeModal} className="text-red-500">
              <CloseIcon />
            </button>
            <Register />
          </div>
        </Modal>
      </div>

      {/* new modal for seller lists */}
      <div>
        <Dialog
          open={sellerDialogOpen}
          onClose={() => setSellerDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Select a Seller</DialogTitle>
          <DialogContent>
            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
              <List>
                {sellerList.map((seller) => (
                  <ListItem key={seller.userId} disablePadding>
                    <ListItemButton
                      selected={selectedUserIds === seller.userId}
                      // onClick={() => toggleSelection(seller.userId)}
                      onClick={() => setSelectedUserIds(seller.userId)}
                    >
                      <ListItemText
                        primary={seller.sellerName}
                        secondary={`${seller.email} (User ID: ${seller.userId})`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAdminContinue}>Skip</Button>
            <Button
              onClick={handleSellerConfirm}
              disabled={selectedUserIds === null}
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>


      
    </div>
  );
};

export default Login;
