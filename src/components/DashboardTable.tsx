import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { paymentModal } from "../Redux/features/paymentModalSlice";
import { TTableData, TTableHeaderData, TDashboardTableProps } from "../utils/types";

const DashboardTable = ({ bodyItems, headerItems }: TDashboardTableProps) => {
	const dispatch = useAppDispatch();
	const { isOpenModal } = useAppSelector((state) => state.paymentModal);

	const handlePayClick = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		dispatch(paymentModal(true));
	};

	return (
		<div className="mt-5 border border-borderColor rounded-[10px]">
			<table className="w-full rounded-[10px]">
				<thead className="rounded-t-[10px] bg-[#FAFAFA]">
					<tr className="text-left border-b border-b-borderColor rounded-t-[10px]">
						{headerItems.map(({ id, label }: TTableHeaderData) => (
							<th
								key={id}
								className={`p-[15px] font-medium text-gray-700 rounded-t-[10px] border-r border-r-borderColor ${
									id === 6 && "text-center"
								} last:text-center last:border-r-0`}
							>
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{bodyItems.map(
						({
							id,
							name,
							seller,
							marketplace,
							itemNumber,
							date,
							status,
						}: TTableData) => (
							<tr key={id} className="border-b last:border-b-0">
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{name}
								</td>
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{seller}
								</td>
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{marketplace}
								</td>
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{itemNumber}
								</td>
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{date}
								</td>
								<td className="p-[15px] border-r border-borderColor">
									<button className="w-full px-3 py-1.5 text-xs font-medium font-poppins text-green bg-lightGreen rounded-[5px] border border-borderGreen">
										{status}
									</button>
								</td>
								<td className="p-[15px] flex flex-col items-center">
									<button
										onClick={handlePayClick}
										className={`px-[15px] py-1.5 text-xs font-medium font-poppins text-white ${
											isOpenModal ? "bg-green/60" : "bg-primary"
										} rounded-[5px]`}
									>
										Pay
									</button>
								</td>
							</tr>
						)
					)}
				</tbody>
			</table>
		</div>
	);
};

export default DashboardTable;
