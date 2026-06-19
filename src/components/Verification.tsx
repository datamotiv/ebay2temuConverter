import { useState } from "react";
import Input from "./input/Input";
import { Link } from "react-router-dom";
import loginImage from "../assets/images/loginImage.png";

const Verification = () => {
	const [loginInfo, setLoginInfo] = useState({
		email: "",
		password: "",
	});

	return (
		<div className="w-full h-screen flex items-center p-[50px] gap-[250px] justify-between bg-[#F3F3F3] relative overflow-hidden z-10">
			<div className="fixed bottom-[-500px] right-[-650px] bg-primary w-[2000px] h-[700px] rotate-[140deg] -z-50" />
			<div className="flex flex-col h-full justify-between max-w-[420px] w-full">
				<Link
					to={"/"}
					className="text-black font-rajdhani text-[40px] font-bold"
				>
					e-motiv
				</Link>

				<form action="">
					<h2 className="titleBG mb-[45px]">Enter Verification Code</h2>
					<div className="flex gap-6 mb-[45px]">
						<div className="w-[112px] h-[60px] bg-white rounded-lg">
							<Input
								value={loginInfo?.email}
								onChange={(newValue) =>
									setLoginInfo({
										...loginInfo,
										email: newValue,
									})
								}
								type="text"
								className="p-2 text-center w-full h-full border-[#EE7178] bg-white overflow-hidden"
							/>
						</div>
						<div className="w-[112px] h-[60px] bg-white rounded-lg">
							<Input
								value={loginInfo?.email}
								onChange={(newValue) =>
									setLoginInfo({
										...loginInfo,
										email: newValue,
									})
								}
								type="text"
								className="p-2 text-center w-full h-full border-[#EE7178] bg-white overflow-hidden"
							/>
						</div>
						<div className="w-[112px] h-[60px] bg-white rounded-lg">
							<Input
								value={loginInfo?.email}
								onChange={(newValue) =>
									setLoginInfo({
										...loginInfo,
										email: newValue,
									})
								}
								type="text"
								className="p-2 text-center w-full h-full border-[#EE7178] bg-white overflow-hidden"
							/>
						</div>
						<div className="w-[112px] h-[60px] bg-white rounded-lg">
							<Input
								value={loginInfo?.email}
								onChange={(newValue) =>
									setLoginInfo({
										...loginInfo,
										email: newValue,
									})
								}
								type="text"
								className="p-2 text-center w-full h-full border-[#EE7178] bg-white overflow-hidden"
							/>
						</div>
					</div>
					<button className="bg-black px-4 py-4 text-white rounded-[10px] min-w-[160px] font-rajdhani text-xl font-medium border-[2px] border-[#0E6698]">
						Verify
					</button>
				</form>
				<div className="flex flex-col gap-4">
					<button className="w-full bg-[#EB2732] flex justify-between py-[15px] px-4 rounded-[10px]">
						<span className="font-rajdhani text-white text-base font-medium">
							Experiencing issues receiving the code?
						</span>
						<span className="font-rajdhani underline text-white font-semibold">
							Resend Code
						</span>
					</button>
				</div>
			</div>
			<div className="pr-[200px]">
				<img src={loginImage} alt="" />
			</div>
		</div>
	);
};

export default Verification;
