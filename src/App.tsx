import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Input from "./components/input/Input";
import CloseIcon from "./assets/icons/CloseIcon";
import { FormEvent, useEffect, useState } from "react";
import { useAppSelector } from "./Redux/hooks";
import { paymentModal } from "./Redux/features/paymentModalSlice";
import { registerModal } from "./Redux/features/registerSellerModalSlice";
import { useDispatch } from "react-redux";
import axios from "axios";


const App = () => {
 
  const dispatch = useDispatch();
  

  const handleSellerInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
//      const response = await axios.get('http://localhost:8086/api/datacube/public/ebayauth', {
      const response = await axios.get('https://api.help-on-time.com/api/datacube/public/ebayauth', {
        headers: {
          'Authorization': `Bearer ` + token
        }
      });
      // console.log(response.data)
      if (response.status === 200) {
        const ebayOAuthUrl = response.data;
        window.location.href = ebayOAuthUrl;
      }
    } catch (error) {
      console.error("Error fetching eBay auth URL:", error);
    }
    dispatch(registerModal(false));
  };

  const { isOpenModal } = useAppSelector((state) => state.paymentModal);
  const { isOpenRegisterModal } = useAppSelector(
    (state) => state.registerModal
  );

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
  });

  useEffect(() => {
    if (isOpenModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpenModal]);

  const handlePayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("paymentInfo:", paymentInfo);
    dispatch(paymentModal(false));
  };

  return (
    <div className={`flex relative ${isOpenModal && "overflow-y-hidden"}  min-h-[100vh]`}>
     
      <div className="w-[200px] z-[200]">

        <Sidebar />
      </div>
      <div className="w-[calc(100vw-200px)] mt-16">
        <Outlet />
      </div>
      {isOpenModal && (
        <div className="absolute bg-secondary/70 w-full min-h-screen flex flex-col justify-center items-center">
          <form
            onSubmit={handlePayment}
            className="bg-white p-[30px] rounded-[10px] w-full max-w-[550px]"
          >
            <div className="flex justify-between items-center gap-4 mb-[30px]">
              <h1 className="text-[22px] font-poppins font-semibold">
                Enter Card Details:
              </h1>
              <div
                className="cursor-pointer"
                onClick={() => dispatch(paymentModal(false))}
              >
                <CloseIcon />
              </div>
            </div>
            <div className="flex flex-col gap-[15px]">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm text-secondary font-poppins"
                  htmlFor="cardNumber"
                >
                  Card Number
                </label>
                <Input
                  type="tel"
                  id="cardNumber"
                  name="cardNumber"
                  className="py-2.5 px-[15px]"
                  onChange={(newValue) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cardNumber: newValue,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm text-secondary font-poppins"
                  htmlFor="expiration"
                >
                  Expiration
                </label>
                <div className="flex items-center gap-2.5">
                  <Input
                    type="tel"
                    id="expirationMonth"
                    name="expirationMonth"
                    className="py-2.5 px-[15px] w-full max-w-[328px] placeholder:text-xs placeholder:text-[#5A5A5A] placeholder:font-poppins placeholder:font-light"
                    placeholder="Month"
                    onChange={(newValue) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        expirationMonth: newValue,
                      })
                    }
                  />
                  <span className="text-sm text-[#737373] font-poppins">/</span>
                  <Input
                    type="tel"
                    id="expirationYear"
                    name="expirationYear"
                    className="py-2.5 px-[15px] w-full max-w-[328px] placeholder:text-xs placeholder:text-[#5A5A5A] placeholder:font-poppins placeholder:font-light"
                    placeholder="Year"
                    onChange={(newValue) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        expirationYear: newValue,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm text-secondary font-poppins"
                  htmlFor="cardNumber"
                >
                  CVV
                </label>
                <Input
                  type="tel"
                  id="cvv"
                  name="cvv"
                  className="py-2.5 px-[15px]"
                  onChange={(newValue) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cvv: newValue,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-xl text-white font-poppins font-medium bg-primary rounded-[10px]"
              >
                Pay
              </button>
            </div>
          </form>
        </div>
      )}
      {isOpenRegisterModal && (
        <div className="absolute z-20 bg-secondary/70 w-full min-h-screen flex flex-col justify-center items-center">
          <form
            onSubmit={handleSellerInfo}
            className="bg-white p-[30px] rounded-[10px] w-full max-w-[550px]"
          >
            <div className="flex justify-between items-center gap-4 mb-[30px]">
              <h1 className="text-[22px] font-poppins font-semibold">
              Link your eBay store
              </h1>
              <div
                className="cursor-pointer"
                onClick={() => dispatch(registerModal(false))}
              >
                <CloseIcon />
              </div>
            </div>
            <div className="flex flex-col gap-[15px]">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm text-secondary font-poppins"
                  htmlFor="sellerName"
                >
                  Press OK to redirect to eBay to complete the registration process.
                </label>
                {false && <input
                  type="text"
                  id="sellerName"
                  name="sellerName"
                  className="py-2.5 px-[15px] rounded-lg border bg-white bg-opacity-10 outline-none"
                />}
              </div>
              <div className="flex justify-between items-center gap-4 mt-5">
                <p
                  className="w-full py-2.5 text-xl text-primary text-center cursor-pointer font-poppins font-medium bg-transparent rounded-[10px] border border-primary"
                  onClick={() => dispatch(registerModal(false))}
                >
                  Cancel
                </p>
                <button
                  type="submit"
                  className="w-full py-2.5 text-xl text-white font-poppins font-medium bg-primary rounded-[10px]"
                >
                  Ok
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
