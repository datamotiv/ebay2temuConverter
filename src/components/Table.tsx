import { useNavigate } from "react-router";
import CheckIcon from "../assets/icons/CheckIcon";
import { TSearchTableData, TTableHeaderData, TTableProps } from "../utils/types";

const Table = ({ bodyItems, headerItems }: TTableProps) => {
	const navigate = useNavigate();
	const handleRowDoubleClick = (id: string) => {
		navigate(`/ebay-search-report/${id}`);
	  };
	return (
		<div className="border border-borderColor rounded-[10px]">
			<table className="w-full rounded-[10px]">
				<thead className="rounded-t-[10px] bg-[#FAFAFA]">
					<tr className="text-left border-b border-b-borderColor rounded-t-[10px]">
						{headerItems.map(({ id, label }: TTableHeaderData) => (
							<th
								key={id}
								className="p-[15px] font-medium text-gray-700 rounded-t-[10px] border-r border-r-borderColor last:border-r-0"
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
							count,
							date,
							downloadReportAvailable,
							name,
							revisionsAllowed,
							status,
						}: TSearchTableData) => (
							<tr key={id} onDoubleClick={() => handleRowDoubleClick(id)} className="border-b last:border-b-0 cursor-pointer">
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{date}
								</td>
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{name}
								</td>
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{count}
								</td>
								<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
									{revisionsAllowed === true ? "True" : "false"}
								</td>
								<td className="p-[15px]">
									{downloadReportAvailable ? <button className="w-full max-w-[120px] px-3 py-1.5 text-xs font-medium font-poppins text-green bg-lightGreen rounded-[5px] border border-borderGreen flex items-center gap-2">
										<span>{status}</span>
										<CheckIcon />
									</button> : "False"}
								</td>
							</tr>
						)
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
