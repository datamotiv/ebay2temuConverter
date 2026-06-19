import { useState } from "react";
import loginImage from "../assets/images/loginImage.png";
import Input from "../components/input/Input";
import { Link } from "react-router-dom";

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="w-full h-screen flex items-center p-[50px] gap-[250px] justify-between bg-[#F3F3F3] relative overflow-hidden z-10">
      <div className="fixed bottom-[-500px] right-[-650px] bg-primary w-[2000px] h-[700px] rotate-[140deg] -z-50" />
      <div className="flex flex-col h-full justify-between max-w-[420px] w-full">
        <Link to={"/"} className="text-black font-rajdhani text-[40px] font-bold">
          e-motiv
        </Link>

        <form action="">
          <h2 className="titleBG mb-[45px]">Set New Password</h2>
          <div className="flex flex-col gap-4 mb-[45px]">
            <div className="space-y-2">
              <label htmlFor="newPassword">New password</label>
              <Input
                id="newPassword"
                name="newPassword"
                value={newPassword.newPassword} // Use 'value' here
                onChange={(newValue) =>
                  setNewPassword({
                    ...newPassword,
                    newPassword: newValue,
                  })
                }
                type="text"
                className="p-2 w-full border-[#EE7178]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                value={newPassword.confirmPassword} // Use 'value' here
                onChange={(newValue) =>
                  setNewPassword({
                    ...newPassword,
                    confirmPassword: newValue,
                  })
                }
                type="password"
                className="p-2 w-full border-[#EE7178]"
              />
            </div>
          </div>
          <button className="bg-black px-4 py-4 text-white rounded-[10px] min-w-[160px] font-rajdhani text-xl font-medium border-[2px] border-[#0E6698]">
            Confirm
          </button>
        </form>
        <div className="flex flex-col gap-4">
          <span></span>
        </div>
      </div>
      <div className="pr-[200px]">
        <img src={loginImage} alt="" />
      </div>
    </div>
  );
};

export default SetNewPassword;
