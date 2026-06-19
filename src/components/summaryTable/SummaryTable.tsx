const headerOptions = [
	{
		id: 1,
		label: "eBay Seller",
	},
	{
		id: 2,
		label: "Status",
	},
];

interface Account {
	status: string;
	name: string;
	id: number;
}

interface Accounts {
	accounts: Account[];
}

const SummaryTable = ({ accounts }: Accounts) => {
	return (
    <div className="mt-5 border border-borderColor rounded-[10px]">
			<table className="w-full rounded-[10px] table-fixed">
				<thead className="rounded-t-[10px] bg-[#FAFAFA]">
					<tr className="text-left border-b border-b-borderColor rounded-t-[10px]">
						{headerOptions.map((option) => (
							<th
								key={option.id}
								className="p-[15px] font-medium text-gray-700 rounded-t-[10px] border-r border-r-borderColor last:text-leftF/opt last:border-r-0"
							>
								{option.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{accounts?.map((account, index) => (
						<tr key={index} className="border-b last:border-b-0 ">
							<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
								{account?.name}
							</td>
							<td className="p-[15px] text-sm font-poppins font-light border-r border-borderColor">
								{account?.status}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SummaryTable;
