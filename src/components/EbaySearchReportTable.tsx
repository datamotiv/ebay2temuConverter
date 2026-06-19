export type SellerItem ={
	brand: string | null;
	categoryID: string | null;
	categoryTitle: string | null;
	compatibility: string | null;
	currency: string | null;
	ean: string | null;
	fitments: string | null;
	imageURL: string | null;
	itemNumber: string | null;
	itemSpecifics: string | null;
	listingDate: string | null; 
	mandatorySpecs: string | null;
	manufacturer: string | null;
	mpn: string | null;
	price: number | null; 
	quantitySold: number | null; 
	recommendedSpecs: string | null;
	score: number | null;
	specifications: string | null;
	title: string | null;
	upc: string | null;
	usedRecommendedSpecs: string | null;
  }
  
  interface EbaySearchReportTableProps {
  bodyItems: SellerItem;
  optimizeData?: number;
}



const EbaySearchReportTable = ({ bodyItems}:EbaySearchReportTableProps) => {
	return (
		<div className="border border-borderColor rounded-[10px]">
			<table className="w-full rounded-[10px] table-fixed">
				{/* <thead className="rounded-t-[10px] bg-[#FAFAFA]">
					<tr className="text-left border-b border-b-borderColor rounded-t-[10px]">

						<th className="p-[8px] w-[200px]  font-medium text-gray-700 rounded-t-[10px] border-r border-r-borderColor last:border-r-0">
							Information
						</th>
						<th className="p-[8px] font-medium text-gray-700 rounded-t-[10px] border-r border-r-borderColor last:border-r-0">
							Value
						</th>

					</tr>
				</thead> */}
				<tbody>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] bg-[#F6F6F6] text-sm font-poppins font-light border-r border-borderColor">
						Item Number
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.itemNumber}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] bg-[#F6F6F6] text-sm font-poppins font-light border-r border-borderColor">
						UPC
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.upc}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] bg-[#F6F6F6] text-sm font-poppins font-light border-r border-borderColor">
						EAN
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.ean}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] bg-[#F6F6F6] text-sm font-poppins font-light border-r border-borderColor">
						MPN
					</td>
					<td className="p-[8px]  text-sm font-poppins font-light">
						{bodyItems?.mpn}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Category ID
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.categoryID}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Manufacture
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.manufacturer}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Brand
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.brand}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Category Title
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.categoryTitle}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Title
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.title}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Currency
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.currency}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Price
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.price}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] text-sm bg-[#F6F6F6] font-poppins font-light border-r border-borderColor">
						Listing Date
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.listingDate}
					</td>
				</tr>
				<tr className="border-b last:border-b-0">
					<td className="p-[8px] w-[200px] bg-[#F6F6F6] text-sm font-poppins font-light border-r border-borderColor">
						Quantity Sold
					</td>
					<td className="p-[8px] text-sm font-poppins font-light">
						{bodyItems?.quantitySold}
					</td>
				</tr>
				</tbody>
			</table>
		</div>
	);
};

export default EbaySearchReportTable;
