import Navbar from '../components/Navbar'
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { registerModal } from "../Redux/features/registerSellerModalSlice";
import { useAppDispatch } from "../Redux/hooks";

const RegisterEbay = () => {
    const dispatch = useAppDispatch();

  return (
    <>  
     <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar  />
      </div>  

<div className='flex justify-center items-center w-1/2 h-1/4'>
      <div className="relative top-1/2">
                        <button
                            onClick={() => dispatch(registerModal(true))}
                            className="px-5 py-2.5 text-sm text-white bg-primary font-poppins font-medium rounded-[5px]"
                          >
                            Click here to Link your eBay store
                          </button>
                          <Tooltip title="If you require to Link your eBay store">
                            <InfoIcon
                              style={{
                                fontSize: 11,
                                color: "grey",
                                marginLeft: 8,
                              }}
                            />
                          </Tooltip>
                        </div>
                        </div>
    </>
  )
}

export default RegisterEbay