export type TDashboardItems = {
	id: number;
	url: string;
	label: string;
	icon: React.ElementType | "";
	tooltip: string;
	children?: TDashboardItems[];
	// onClick: ()=> void;
};

export type TTableData = {
	id: string;
	name?: string;
	date?: string;
	title?: string;
	status: string;
	seller: string;
	searchDate?: string;
	marketplace: string;
	itemNumber: string;
};

export type TSearchTableData = {
	id: string;
	count: number;
	date: string;
	downloadReportAvailable: boolean;
	name: string;
	revisionsAllowed: boolean;
	status: string;
};

export type TCategoryTableData={
	id:number;
	fitmentStatus:boolean;
	itemID:string
	listingDate:string;
	searchResultID:number;
	title:string;
	optimizationPercent: string;
	status: string;
}

export type TTableHeaderData = {
	id: number | string;
	label: string;
	tooltip?: string
};

export type TTableProps = {
	bodyItems: TSearchTableData[];
	headerItems: TTableHeaderData[] ;
};
export type TDashboardTableProps = {
	bodyItems: TTableData[];
	headerItems: TTableHeaderData[];
};

export interface TCTableProps {
	bodyItems: TCategoryTableData[];
	headerItems: TTableHeaderData[];
  }
export type TEbayReportHistory = {
	id: string;
	value?: string;
	information: string;
};

export type TLocation = {
	id: number;
	label: string;
};

export type TTagStyle = string;

export type TOptimizationTableData = {
	id?: string;
	item?: string;
	used?: string | number;
	note?: string;
	recommended?: string | number;
	optimizationType?: string;
};

export type TUserTable = {
	id: string;
	name: string;
	company: string;
	phone: string;
	email: string;
	country: string;
	status: "Active" | "Inactive";
};

export type TOptimizationTableTwoData = {
	id: string;
	item: string;
	recommendedMandatory: string;
	value?: string;
};

export type TOptimizationTableThreeBodyData = {
	id: string;
	year: number;
	make: string;
	model: string;
	trim?: string;
	engine: string;
};

export type TDashboardTableBodyData = {
	id:  string;
	description?: string;
	date?: string;
	status: string;
	action: string;
};


// export type FitmentScoreRequest  ={
// 	site: string | null;
//   categoryID: number | null;
// }