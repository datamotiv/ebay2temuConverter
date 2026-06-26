import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CloseIcon from './assets/icons/CloseIcon';
import { FormEvent } from 'react';
import { useAppSelector } from './Redux/hooks';
import { registerModal } from './Redux/features/registerSellerModalSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const EBAY_AUTH_URL = import.meta.env.VITE_EBAY_AUTH_URL as string;

const App = () => {
  const dispatch = useDispatch();
  const { isOpenRegisterModal } = useAppSelector(
    (state) => state.registerModal,
  );

  const handleSellerInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(EBAY_AUTH_URL, {
        headers: {
          Authorization: `Bearer ` + token,
        },
      });
      if (response.status === 200) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error('Error fetching eBay auth URL:', error);
    }
    dispatch(registerModal(false));
  };

  return (
    <div className="flex relative min-h-[100vh]">
      <div className="w-[200px] z-[200]">
        <Sidebar />
      </div>
      <div className="w-[calc(100vw-200px)] mt-16">
        <Outlet />
      </div>
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
                  Press OK to redirect to eBay to complete the registration
                  process.
                </label>
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
