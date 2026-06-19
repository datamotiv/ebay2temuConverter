/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Register.css";
import toast from "react-hot-toast";
import React, { useState } from "react";
import Input from "../components/input/Input";
// import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../Redux/features/auth/authApi";
import { setAccessToken } from "../Redux/features/auth/authSlice";
import { useAppDispatch } from "../Redux/hooks";
// import registerBg from "../assets/images/registerBg.png";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  
} from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import autofitProLogo from "../assets/images/autofitProLogo.png"
import PhoneInput , {isPossiblePhoneNumber} from 'react-phone-number-input'
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";
import autoIftpowered from "../assets/images/autofitpowered.png"

interface RegisterInfo {
  fullName: string;
  email: string;
  phoneNumber: any; // Ensure this is always a string
  companyName: string;
  ebayStoreName: string;
  numberOfLiveItems: string;
  password: string;
  confirmPassword: string;
  discountCode: string;
}

const Register = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignupMutation();
  const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useAppDispatch();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    fullName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
     ebayStoreName:"",
    numberOfLiveItems: "",
    password: "",
    confirmPassword:"",
    discountCode:''
  });
  const [error, setError] = useState({
    password:'',
    confirmPassword:''
  });  // For validation errors
  const [isAgreedToTnC, setIsAgreedToTnC] = useState(false); // State for 
  
    const handleSellerInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://api.help-on-time.com/api/datacube/public/ebayauth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          const ebayOAuthUrl = response.data;
          // window.location.href = ebayOAuthUrl; // redirect immediately
          window.open(ebayOAuthUrl, "_blank"); // Open in new tab
        }
      } catch (error) {
        console.error("Error fetching eBay auth URL:", error);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    // debugger;
    e.preventDefault();

      let inputError = {
        password:'',
        confirmPassword:'',
      }

      if (!registerInfo.phoneNumber || !isPossiblePhoneNumber(registerInfo.phoneNumber)) {
        toast.error("Please enter a valid phone number.");
        return;
      }

    if (registerInfo.password !== registerInfo.confirmPassword) {
      // setError({
      //   ...inputError,
      //   confirmPassword: "Password and confirm password should be the same."
      // });
      inputError.confirmPassword = "Passwords do not match.";
   return;
  }

//  const codeCheck = registerInfo.discountCode.trim().toUpperCase();
// if (codeCheck !== "CODE10" && codeCheck !== "CODE20" && codeCheck !== "CODE30") {
//   toast.error("Please use correct discount code URL.");
//   return;
// }

  setError({ password: '', confirmPassword: '' }); 

    const data = {
      fullName: registerInfo.fullName,
      email: registerInfo.email,
      phoneNumber: registerInfo.phoneNumber,
      companyName: registerInfo.companyName,
      ebayStoreName: registerInfo.ebayStoreName,
      numberOfLiveItems: registerInfo.numberOfLiveItems,
      password: registerInfo.password,
      discountCode: registerInfo.discountCode,
      role: ["user"],      
    };
// console.log(data);
    try {
    let result= await signUp(data).unwrap();
    // console.log(result, 'check result')
      
      // console.log("Signup API Response:", result); 
   dispatch(setAccessToken(result));

   // Store token in localStorage for persistence
   localStorage.setItem("accessToken", result.accessToken);
   localStorage.setItem("userName", registerInfo.fullName);

      toast.success("User registration successful");
      localStorage.setItem("isNewUser", "true"); 
handleSellerInfo();
      // navigate("/dashboard");
      // console.log(navigate, 'find out')
      window.open("/dashboard", "_blank");

    } catch (error: any) {
      console.error("Error details:", error);
      if (error.data?.message) {
        toast.error(`${error.data.message}`);
      } else {
        toast.error("An error occurred while registering.");
      }
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const codeFromURL = queryParams.get("code");
  
    if (codeFromURL) {
      setRegisterInfo(prev => ({
        ...prev,
        discountCode: codeFromURL.toUpperCase()
      }));
    }
  }, [location.search]);

  const isFormValid = () => {
    const {
      fullName,
      email,
      phoneNumber,
      companyName,
      ebayStoreName,
      numberOfLiveItems,
      password,
      confirmPassword,
      // discountCode,
    } = registerInfo;
  
    return (
      fullName.trim() &&
      email.trim() &&
      (phoneNumber ? phoneNumber.toString().trim() : "") &&
      companyName.trim() &&
      ebayStoreName.trim() &&
      numberOfLiveItems.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      password === confirmPassword &&
      isAgreedToTnC &&
      error.password === "" &&
      error.confirmPassword === ""
      // discountCode.trim().toUpperCase() === "CODE5"
    );
  };
  

  return (
    <div
      // style={{
      //   background: `url(${registerBg})`,
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "100% 100%",
      //   backgroundPosition: "top left",
      // }}
      className="register-container register-bg hide-register-bg w-full h-screen flex items-center  gap-[250px] justify-between bg-[#F3F3F3] relative overflow-hidden z-10 "
    >
      <div className="absolute bottom-4 right-4 z-30">
        <img
          src={autoIftpowered}
          alt="bottomLogo"
          className="w-[400px] h-auto object-contain hideAutoFirPro"
        />
      </div>
      <div className="hide-register-logo"><img src={autofitProLogo} alt="autoFit Pro" /></div>
        <div style={{
        backgroundColor:'white', borderRadius: '1rem'
      }} className="register-form-wrapper flex ml-11 py-4 px-12 flex-col  items-center justify-between  w-1/3  border-r-6">
        <form onSubmit={handleSubmit} >
          <h1 className="register-title titleBG text-4xl font-bold mb-8">Register</h1>
          <div className="register-form-group flex flex-col gap-2 mb-[25px]">
            <div >
              {/* full name */}
              <div  className="register-form-group">
                {/* <label htmlFor="fullName">Full name</label> */}
                <Input
                  id="fullName"
                  name="fullName"
                  value={registerInfo?.fullName}
                  onChange={(newValue) =>
                    setRegisterInfo({ ...registerInfo, fullName: newValue })
                  }
                  placeholder="Full Name"
                  type="text"
                  className="p-2 w-full border-[#EE7178]"
                />
              </div>
             
            </div>
           
            {/* Email */}
            <div>
             
              <Input
                id="email"
                name="email"
                value={registerInfo?.email}
                onChange={(newValue) =>
                  setRegisterInfo({ ...registerInfo, email: newValue })
                }
                placeholder="Email Address"
                type="email"
                className="p-2 w-full border-[#EE7178]"
              />
            </div>

            {/* Phone number */}
            <div className="flex items-center gap-2 w-full max-w-md border-b border-[#EE7178]">
             
            <PhoneInput
                className="flex items-center gap-2  w-full "
             international
             defaultCountry="US"
             countryCallingCodeEditable={false}
  placeholder="Enter phone number"

  value={registerInfo?.phoneNumber ?? ''}
  onChange={(newValue) =>
    setRegisterInfo({ ...registerInfo, phoneNumber: newValue })
  }

  />
{registerInfo?.phoneNumber && isPossiblePhoneNumber(registerInfo?.phoneNumber) ? (
    <p className="mt-1 text-sm text-green"><CheckCircleIcon style={{color:'green'}} /></p>
  ): ( <p className="mt-1 text-sm text-red-600"><CancelIcon style={{color:'red'}} /> </p>)}
            </div>

            {/* Company name */}
            <div>
              {/* <label htmlFor="companyName">Full name</label> */}
              <Input
                id="companyName"
                name="companyName"
                value={registerInfo?.companyName}
                onChange={(newValue) =>
                  setRegisterInfo({ ...registerInfo, companyName: newValue })
                }
                placeholder="Company Name"
                type="text"
                className="p-2 w-full border-[#EE7178]"
              />
            </div>

            {/* EBAY store name */}
            <div>
              {/* <label htmlFor="firstName">Full name</label> */}
              <Input
                id="ebayStoreName"
                name="ebayStoreName"
                value={registerInfo?.ebayStoreName}
                onChange={(newValue) =>
                  setRegisterInfo({ ...registerInfo, ebayStoreName: newValue })
                }
                placeholder="Store Name"
                type="text"
                className="p-2 w-full border-[#EE7178]"
              />
            </div>
            {/* NO OF LINE ITEMS */}
            <div>
              {/* <label htmlFor="firstName">Full name</label> */}
              <Input
                id="numberOfLiveItems"
                name="numberOfLiveItems"
                value={registerInfo?.numberOfLiveItems}
                onChange={(newValue) =>
                  setRegisterInfo({
                    ...registerInfo,
                    numberOfLiveItems: newValue,
                  })
                }
                placeholder="No. Of Line Items"
                type="text"
                className="p-2 w-full border-[#EE7178]"
              />
            </div>
            {/* Password */}
            <div>
              {/* <label htmlFor="password">Password</label> */}
              <Input
                id="password"
                name="password"
                value={registerInfo.password}
                // onChange={(newValue) =>
                //   setRegisterInfo({ ...registerInfo, password: newValue })
                // }
                onChange={(newValue) => {
                  const newPassword = newValue;
                  setRegisterInfo({ ...registerInfo, password: newPassword });
          
                  // Live validation
                  if (newPassword.length < 6) {
                      setError((prev) => ({ ...prev, password: "Password must be at least 6 characters long." }));
                  } else {
                      setError((prev) => ({ ...prev, password: "" }));
                  }
              }}
                placeholder="Password"
                type="password"
                className="p-2 w-full border-[#EE7178]"
              />
                 {error.password && <p className="text-red-500">{error.password}</p>}
            </div>
           
            {/* retype password */}
            <div>
              {/* <label htmlFor="password">Password</label> */}
              <Input
        id="confirmPassword"
        name="confirmPassword"
        value={registerInfo.confirmPassword}
      //   onChange={(newValue) =>
      //     setRegisterInfo({ ...registerInfo, confirmPassword: newValue })
      // }   
      onChange={(newValue) => {
        const confirmPassword = newValue;
        setRegisterInfo({ ...registerInfo, confirmPassword });

        // Live validation
        if (confirmPassword !== registerInfo.password) {
            setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
        } else {
            setError((prev) => ({ ...prev, confirmPassword: "" }));
        }
    }}
        placeholder="Retype Password"
        type="password"
        className="w-full border-[#EE7178]"
    />
{error.confirmPassword && <p className="text-red-500">{error.confirmPassword}</p>}
            </div>
            {/* <div >
          
              <div>
       
                <Input
                  id="discountCode"
                  name="discountCode"
                  value={registerInfo?.discountCode}
                  onChange={(newValue) =>
                    setRegisterInfo({ ...registerInfo, discountCode: newValue })
                  }
                  placeholder="Discount Code"
                  type="text"
                  className="p-2 w-full border-[#EE7178]"
                />
              </div>
             
            </div> */}
          </div>
          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center mt-0 gap-2 mb-4 w-full text-sm">
            <input
              type="checkbox"
              id="terms"
              checked={isAgreedToTnC}
              onChange={(e) => setIsAgreedToTnC(e.target.checked)}
            />
            <label htmlFor="terms">
              <a
                className="text-blue-500 cursor-pointer"
                onClick={handleOpenDialog}
              >
  I have read and accept the Terms and Conditions and Privacy Policy
              </a>
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              // disabled={!isAgreedToTnC}
              disabled={
              !isFormValid()
                // registerInfo.discountCode.trim().toUpperCase() !== "CODE5"
              }
              style={{ borderRadius: "2rem" }}
              className={`px-2 py-2 text-white rounded-[10px] min-w-[160px] font-rajdhani text-xl font-medium mb-2 ${
                isFormValid()
                  ? "bg-black cursor-pointer"
                  : "bg-[#ED1F24] cursor-not-allowed"
              }`}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
       
        </form>

        {/* 🎯 Social Media Icons with link */}
        {/* <div className="absolute bottom-8 left-8 flex w-1/3 justify-between items-center z-20">
         
          <div className="flex flex-col items-start">
            <h4 className="text-red text-xs font-rajdhani font-semibold mb-0">
              FOLLOW US ON
            </h4>
            <div className="flex gap-x-1">
              <a
                href="https://www.linkedin.com/company/emotivcorp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon style={{ color: "blue" }} />
              </a>
              <a
                href="https://www.instagram.com/emotiv_corp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon style={{ color: "purple" }} />
              </a>
              <a
                href="https://www.facebook.com/Emotivcorp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon style={{ color: "blue" }} />
              </a>
            </div>
          </div>

   
          <div className="flex items-center gap-x-1">
            <a
              href="https://emotivonline.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LanguageIcon style={{ color: "red" }} />
            </a>

            <p className="text-red-500 italic font-bold font-poppins">
              <span className="text-sm">www.</span>
              <span className="text-lg">EMOTIVONLINE</span>
              <span className="text-sm">.com</span>
            </p>
          </div>
        </div> */}

        <div>
          {" "}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {" "}
              <b> Terms and Conditions </b>
            </DialogTitle>
            <DialogContent className="font-poppins text-sm">
              By Checking this box, you confirm that you have read and agree to{" "}
              <b> EMOTIV’s Terms & Conditions and Privacy Policy.</b> You
              authorize EMOTIV to access, store, and process data from your{" "}
              <b> store and other linked platforms</b> for{" "}
              <b> service delivery, optimization, and reporting </b> as outlined
              in our Terms. Your data will be securely stored and handled in
              compliance with applicable laws. EMOTIV will not share or sell
              your data without consent, except as required by law. You may{" "}
              <b> revoke this authorization</b> at any time by written request,
              but this may affect service delivery and could result in contract
              termination per our Terms. <b>EMOTIV </b> reserves the right to report or take down any listings at any time if any of its terms are not met, and may seek damages, e.g., for non-payment.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      {/* Dialog Box */}

      {/*right part */}
      {/* <div className="pr-[200px]">
        <img src={loginImage} alt="Login" />
      </div> */}
    </div>
  );
};

export default Register;
