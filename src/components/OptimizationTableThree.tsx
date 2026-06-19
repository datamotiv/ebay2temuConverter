import {
	TTableHeaderData,
	TOptimizationTableThreeBodyData,
} from "../utils/types";

type TTableProps = {
	headerItems: TTableHeaderData[];
	bodyItems: TOptimizationTableThreeBodyData[];
};

const OptimizationTableThree = ({ bodyItems, headerItems }: TTableProps) => {
	return (
		<div className="border border-borderColor overflow-y-scroll max-h-[300px] ">
			<table className="w-full rounded-[20px] table-fixed">
				<thead className="rounded-t-[10px] bg-[#FAFAFA] sticky top-0 z-10">
					<tr className="text-left border-b border-b-borderColor rounded-t-[10px]">
						{headerItems.map(({ id, label }: TTableHeaderData, index:number) => (
							<th
								key={id}
								className={`p-[8px] font-medium text-gray-700 rounded-t-[10px] border-r border-r-borderColor last:border-r-0 ${
									index < 3 ? "w-[80px]" : index === 3 ? "w-[120px]" : "w-full"
								  }`}
								  
							>
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{bodyItems && bodyItems.map(
						({
							id,
							year,
							make,
							model,
							trim,
							engine,
						}: TOptimizationTableThreeBodyData) => (
							<tr key={id} className="border-b last:border-b-0">
								<td className="p-[5px] text-sm font-poppins font-light border-r border-r-borderColor w-[100px]">
									{year}
								</td>
								<td className="p-[5px] text-sm font-poppins font-light border-r border-r-borderColor w-[100px]">
									{make}
								</td>
								<td className="p-[5px] text-sm font-poppins font-light border-r border-r-borderColor w-[100px]">
									{model}
								</td>
								<td className="p-[5px] text-sm font-poppins font-light border-r border-r-borderColor w-[100px]">
									{trim ? trim : ""}
								</td>
								<td className="p-[5px] text-sm font-poppins font-light border-r border-r-borderColor w-[175px] whitespace-nowrap">
									{engine}
								</td>
							</tr>
						)
					)}
				</tbody>
			</table>
		</div>
	);
};

export default OptimizationTableThree;
