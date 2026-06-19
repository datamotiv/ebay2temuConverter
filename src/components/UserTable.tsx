import { TTableHeaderData, TUserTable } from "../utils/types";

type TUserTableProps = {
	bodyItems: TUserTable[];
	headerItems: TTableHeaderData[];
};

const UserTable = ({ bodyItems, headerItems }: TUserTableProps) => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						{headerItems.map(({ id, label }: TTableHeaderData) => (
							<th
								key={id}
								className="text-sm text-[#B5B7C0] text-left py-3 px-4 font-poppins font-medium border-b border-b-borderColor"
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
							company,
							phone,
							email,
							country,
							status,
						}: TUserTable) => (
							<tr key={id}>
								<td className="text-left py-3 px-4 border-b border-b-borderColor test-sm text-[#292D32] font-poppins font-medium">
									{name}
								</td>
								<td className="text-left py-3 px-4 border-b border-b-borderColor test-sm text-[#292D32] font-poppins font-medium">
									{company}
								</td>
								<td className="text-left py-3 px-4 border-b border-b-borderColor test-sm text-[#292D32] font-poppins font-medium">
									{phone}
								</td>
								<td className="text-left py-3 px-4 border-b border-b-borderColor test-sm text-[#292D32] font-poppins font-medium">
									{email}
								</td>
								<td className="text-left py-3 px-4 border-b border-b-borderColor test-sm text-[#292D32] font-poppins font-medium">
									{country}
								</td>
								<td className="text-left py-3 px-4 border-b border-b-borderColor">
									<span
										className={`px-2 py-1 rounded-[4px] text-sm font-medium ${
											status === "Active"
												? "bg-[#16C09861] text-[#008767] border border-[#00B087]"
												: "bg-[#FFC5C5] text-[#DF0404] border border-[#DF0404]"
										}`}
									>
										{status}
									</span>
								</td>
							</tr>
						)
					)}
				</tbody>
			</table>
		</div>
	);
};

export default UserTable;
