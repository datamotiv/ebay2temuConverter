import { TTableHeaderData, TOptimizationTableTwoData } from "../utils/types";

type TTableProps = {
	headerItems: TTableHeaderData[];
	bodyItems: TOptimizationTableTwoData[];
};

const OptimizationTableTwo = ({ bodyItems, headerItems }: TTableProps) => {
	return (
		<>
	
		<div className="border border-borderColor overflow-y-scroll h-[calc(100vh-400px)] rounded-[10px]">
			
		<table className="w-full rounded-[10px] table-fixed">
		  <thead className="rounded-t-[10px]  text-sm bg-[#FAFAFA] sticky top-0 z-10">
			<tr className="text-left border-b border-b-borderColor rounded-t-[10px]">
			  {headerItems.map(({ id, label }: TTableHeaderData, index: number) => (
				<th
				  key={id}
				  className={`p-[8px] font-medium font-poppins text-gray-700 rounded-t-[10px] border-r border-r-borderColor last:border-r-0 ${
					index == 0 ? "w-[205px]" : index == 1 ? "w-[130px]" : "w-full"
				  }`}
				>
				  {label}
				</th>
			  ))}
			</tr>
		  </thead>
		  <tbody>
			{bodyItems &&
			  bodyItems.map(
				({ id, item, recommendedMandatory, value }: TOptimizationTableTwoData) => (
				  <tr key={id} className="border-b last:border-b-0">
					<td className="p-[8px] text-xs font-poppins font-light border-r border-r-borderColor w-[100px]">
					  {recommendedMandatory}
					</td>
					<td className="p-[8px] text-xs font-poppins font-light border-r border-r-borderColor w-[200px]">
					  {item}
					</td>
					<td className="p-[8px] text-xs font-poppins font-light w-full">
					  {value}
					</td>
				  </tr>
				)
			  )}
		  </tbody>
		</table>
	  </div>
	  </>
	  
	);
};

export default OptimizationTableTwo;
