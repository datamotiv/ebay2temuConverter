import { useState } from "react";
import Input from "../components/input/Input";
import loginImage from "../assets/images/loginImage.png";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your logic to handle the forget password action here
  };

  return (
    <div className="w-full h-screen flex items-center p-[50px] gap-[250px] justify-between bg-[#F3F3F3] relative overflow-hidden z-10">
      <div className="fixed bottom-[-500px] right-[-650px] bg-primary w-[2000px] h-[700px] rotate-[140deg] -z-50" />
      <div className="flex flex-col h-full justify-between max-w-[420px] w-full">
        <Link to={"/"} className="text-black font-rajdhani text-[40px] font-bold">
          e-motiv
        </Link>

        <form onSubmit={handleSubmit}>
          <h2 className="titleBG mb-[45px]">Forgot password</h2>
          <div className="flex flex-col gap-4 mb-[45px]">
            <div>
              <label htmlFor="emailAddress">Email Address</label>
              <Input
                id="email"
                name="email"
                value={loginInfo?.email} // Use 'value' instead of 'controlValue'
                onChange={(newValue) =>
                  setLoginInfo({
                    ...loginInfo,
                    email: newValue,
                  })
                }
                placeholder=""
                type="email"
                className="p-2 w-full"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-black px-4 py-4 text-white rounded-[10px] min-w-[160px] font-rajdhani text-xl font-medium border-[2px] border-[#0E6698]"
          >
            Submit
          </button>
        </form>

        <span></span>
      </div>
      <div className="pr-[200px]">
        <img src={loginImage} alt="Login" />
      </div>
    </div>
  );
};

export default ForgetPassword;
