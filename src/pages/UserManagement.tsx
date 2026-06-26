import { useState } from "react";
import ActiveUsersIcon from "../assets/icons/ActiveUsersIcon";
import AngleDown from "../assets/icons/AngleDown";
import ArrowBottomIcon from "../assets/icons/ArrowBottomIcon";
import ArrowTopIcon from "../assets/icons/ArrowTopIcon";
import CustomerIcon from "../assets/icons/CustomerIcon";
import MemberIcon from "../assets/icons/MemberIcon";
import SearchBlackIcon from "../assets/icons/SearchBlackIcon";
import Input from "../components/input/Input";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import { userTableBodyData, userTableHeaderData } from "../utils/data";
// import Pagination from "../components/Pagination";

const UserManagement = () => {
	const [sortInfo, setSortInfo] = useState({
		sortValue: "",
	});

	const handleSearch = (searchValue: string) => {
	};

	return (
		<>
			<Navbar  />it
			<div className="px-10 pb-10">
				<div className="border border-borderColor rounded-[10px] px-[50px] pt-8 pb-9 flex justify-between items-center gap-2 w-full max-w-[968px] mt-[42px]">
					<div className="flex items-center gap-5 border-r border-r-borderColor">
						<CustomerIcon />
						<div className="pr-[56px]">
							<p className="text-sm text-[#ACACAC] font-poppins">
								Total Customers
							</p>
							<h4 className="text-[32px] text-[#333333] font-poppins font-semibold">
								5,423
							</h4>
							<div className="flex items-center">
								<ArrowTopIcon />
								<p className="text-sm text-[#292D32] font-poppins">
									<span className="text-[#00AC4F] font-bold">16%</span> this
									month
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-5 border-r border-r-borderColor">
						<MemberIcon />
						<div className="pr-[56px]">
							<p className="text-sm text-[#ACACAC] font-poppins">Members</p>
							<h4 className="text-[32px] text-[#333333] font-poppins font-semibold">
								1,893
							</h4>
							<div className="flex items-center">
								<ArrowBottomIcon />
								<p className="text-sm text-[#292D32] font-poppins">
									<span className="text-[#D0004B] font-bold">1%</span> this
									month
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-5">
						<ActiveUsersIcon />
						<div className="">
							<p className="text-sm text-[#ACACAC] font-poppins">Active Now</p>
							<h4 className="text-[32px] text-[#333333] font-poppins font-semibold">
								189
							</h4>
						</div>
					</div>
				</div>
				<div className="border border-borderColor rounded-[10px] px-[50px] py-9 mt-[25px]">
					<div className="flex justify-between items-center mb-[30px]">
						<div className="">
							<h1 className="text-[22px] text-secondary font-poppins font-semibold">
								All Users
							</h1>
							<p className="text-sm text-[#16C098] font-poppins">
								Active Users
							</p>
						</div>
						<div className="flex items-center gap-[22px]">
							<div className="relative bg-[#F7F7F7] rounded-[10px]">
								<Input
									type="search"
									name="search"
									className="py-2 pl-10 pr-2 border-transparent w-[300px] placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
									placeholder="Search..."
									onChange={handleSearch}
								/>
								<span className="absolute top-4 left-5">
									<SearchBlackIcon />
								</span>
							</div>
							<div className="relative w-[210px]">
								<select
									className="appearance-none w-full py-2.5 pl-3 pr-10 text-sm text-[#5E5E5E] bg-[#F7F7F7] font-light font-poppins rounded-lg focus:outline-none"
									defaultValue={sortInfo.sortValue || ""}
									onChange={(e) =>
										setSortInfo({
											...sortInfo,
											sortValue: e.target.value,
										})
									}
								>
									<option className="">Short by : Newest</option>
									<option>Short by : Oldest</option>
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
									<AngleDown />
								</div>
							</div>
						</div>
					</div>
					<UserTable
						headerItems={userTableHeaderData}
						bodyItems={userTableBodyData}
					/>
					<div className="flex justify-between items-center mt-[30px]">
						<p className="text-sm text-[#B5B7C0] font-poppins font-medium">
							Showing data 1 to 8 of 256K entries
						</p>
						{/* <Pagination /> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default UserManagement;

// comment 
// comment 
// comment 
// comment 
// comment 
// comment 
// comment 
// comment 
// comment 
// comment 
