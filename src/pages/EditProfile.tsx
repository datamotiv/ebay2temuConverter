import Navbar from "../components/Navbar";
import { FormEvent, useEffect, useState } from "react";
import Input from "../components/input/Input";
import {
  useProfileQuery,
  useProfileUpdateMutation,
} from "../Redux/features/profile/profileApi";
import toast from "react-hot-toast";

const EditProfile = () => {
  const {
    data: profileData,
    refetch,
    isLoading: profileLoading,
    isFetching,
  } = useProfileQuery({});
  const [updateProfileData, { isLoading }] = useProfileUpdateMutation();
  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    fullName:"",
    address: "",
    phoneNumber: "",
    email: "",
    vatNumber: "",
    city: "",
    country: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await updateProfileData(profileInfo);
 
    if (res) {
      toast.success(res.data.message);
    }
  };

  useEffect(() => {
    refetch();
    if (profileData) {
      setProfileInfo(profileData);
    }

  }, [profileData]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar  />
      </div>  
      <div className="pt-[55px] pl-[70px]">
        {profileLoading || isFetching ? (
          <svg
            className="animate-spin h-8 w-8 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-[18px]">
            <div className="flex items-center gap-16">
              <div className="w-full max-w-[880px] rounded-[10px] flex flex-col gap-2">
                <label
                  className="text-base text-[#1C1C1C] font-poppins font-semibold"
                  htmlFor="fullName">
                Full Name
                </label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                  placeholder="Full Name"
                  value={profileInfo.fullName || ""} // Replaced 'controlValue' with 'value'
                  onChange={(newValue) =>
                    setProfileInfo({
                      ...profileInfo,
                      fullName: newValue,
                    })
                  }
                />
              </div>
              {/* <div className="w-full max-w-[405px] rounded-[10px] flex flex-col gap-2">
                <label
                  className="text-base text-[#1C1C1C] font-poppins font-semibold"
                  htmlFor="lastName">
                  Last Name
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                  placeholder="Last Name"
                  value={profileInfo.lastName || ""} // Replaced 'controlValue' with 'value'
                  onChange={(newValue) =>
                    setProfileInfo({
                      ...profileInfo,
                      lastName: newValue,
                    })
                  }
                />
              </div> */}
            </div>
            <div className="w-full max-w-[880px] rounded-[10px] flex flex-col gap-2">
              <label
                className="text-base text-[#1C1C1C] font-poppins font-semibold"
                htmlFor="email">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                placeholder="Your Email"
                value={profileInfo.email || ""} // Replaced 'controlValue' with 'value'
                onChange={(newValue) =>
                  setProfileInfo({
                    ...profileInfo,
                    email: newValue,
                  })
                }
              />
            </div>
            <div className="w-full max-w-[880px] rounded-[10px] flex flex-col gap-2">
              <label
                className="text-base text-[#1C1C1C] font-poppins font-semibold"
                htmlFor="address">
                Address
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                placeholder="Your Address"
                value={profileInfo.address || ""} // Replaced 'controlValue' with 'value'
                onChange={(newValue) =>
                  setProfileInfo({
                    ...profileInfo,
                    address: newValue,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-16">
              <div className="w-full max-w-[405px] rounded-[10px] flex flex-col gap-2">
                <label
                  className="text-base text-[#1C1C1C] font-poppins font-semibold"
                  htmlFor="contactNumber">
                  Contact Number
                </label>

                <Input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                  placeholder="Your Contact Number"
                  value={profileInfo.phoneNumber || ""} // Replaced 'controlValue' with 'value'
                  onChange={(newValue) =>
                    setProfileInfo({
                      ...profileInfo,
                      phoneNumber: newValue,
                    })
                  }
                />
              </div>
{/* 
              <div className="w-full max-w-[405px] rounded-[10px] flex flex-col gap-2">
                <label
                  className="text-base text-[#1C1C1C] font-poppins font-semibold"
                  htmlFor="vat">
                  VAT Number
                </label>

                <Input
                  type="text"
                  id="vat"
                  name="vat"
                  className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                  placeholder="Your VAT Number"
                  value={profileInfo.vatNumber || ""} // Changed defaultValue to value
                  onChange={(newValue) =>
                    setProfileInfo({
                      ...profileInfo,
                      vatNumber: newValue,
                    })
                  }
                />
              </div> */}
            </div>

            <div className="flex items-center gap-16">
              <div className="w-full max-w-[405px] rounded-[10px] flex flex-col gap-2">
                <label
                  className="text-base text-[#1C1C1C] font-poppins font-semibold"
                  htmlFor="city">
                  City
                </label>

                <Input
                  type="text"
                  id="city"
                  name="city"
                  className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                  placeholder="Your city"
                  value={profileInfo.city || ""} // Changed defaultValue to value
                  onChange={(newValue) =>
                    setProfileInfo({
                      ...profileInfo,
                      city: newValue,
                    })
                  }
                />
              </div>
              <div className="w-full max-w-[405px] rounded-[10px] flex flex-col gap-2">
                <label
                  className="text-base text-[#1C1C1C] font-poppins font-semibold"
                  htmlFor="country">
                  Country
                </label>

                <Input
                  type="text"
                  id="country"
                  name="country"
                  className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
                  placeholder="Your Country"
                  value={profileInfo.country || ""} // Changed defaultValue to value
                  onChange={(newValue) =>
                    setProfileInfo({
                      ...profileInfo,
                      country: newValue,
                    })
                  }
                />
              </div>
            </div>

            <div className="w-full max-w-[880px] rounded-[10px] flex flex-col gap-2 relative">
      <label
        className="text-base text-[#1C1C1C] font-poppins font-semibold"
        htmlFor="password"
      >
        Password
      </label>
      <Input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        className="py-2.5 px-[15px] border-borderColor w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
        placeholder="********"
        value={profileInfo?.password || ""}
        onChange={(newValue: string) =>
          setProfileInfo({
            ...profileInfo,
            password: newValue,
          })
        }
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-4 bottom-2.5 text-sm text-[#EE7178]"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
            <div className="pt-[35px] space-x-10 flex align-middle">
              <button
                type="button"
                className="text-lg text-primary font-poppins font-medium border border-primary py-2.5 px-[47px] rounded-[5px]">
                Cancel
              </button>
              <button
                type="submit"
                className={`text-lg text-white font-poppins font-medium bg-primary py-2.5 px-[60px] rounded-[5px]`}
                disabled={isLoading}>
                {isLoading ? (
                  <svg
                    className="animate-spin h-6 w-8 text-gray-800"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditProfile;
