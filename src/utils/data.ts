import {
  TLocation,
  TTableData,
  TUserTable,
  TDashboardItems,
  TTableHeaderData,
  TEbayReportHistory,
  TOptimizationTableData,
  TTagStyle,
  TOptimizationTableThreeBodyData,
  TDashboardTableBodyData,
} from "./types";
// import HomeIcon from "../assets/icons/HomeIcon";
// import EditProfileIcon from "../assets/icons/EditProfileIcon";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Person4RoundedIcon from '@mui/icons-material/Person4Rounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';


export const dashboardItems: TDashboardItems[] = [
  {
    id: 1,
    url: "/dashboard",
    label: "Dashboard",
    // icon: HomeIcon,
    icon: DashboardRoundedIcon,
    tooltip: "",
  },
  {
    id: 11,
    url: "/billing",
    label: "Billing",
    icon: ReceiptLongRoundedIcon,
    tooltip: "Usage & Billing",
  },

  
  // {
  //   id: 3,
  //   url: "/fitmentAdoptionSummary",
  //   label: "Overview",
  //   icon: HomeRoundedIcon,
  //   tooltip:'',
  //   children: [
  //     {
  //       id: 31,
  //       url: "/fitmentAdoptionSummary",
  //       label: "Fitment Adoption Summary",
  //       icon: "",
  //       tooltip:'',
  //     },
  //     {
  //       id: 32,
  //       url: "/listingOptimizationSummary",
  //       label: "Listing Optimization",
  //       icon: FormatListBulletedRoundedIcon,
  //       tooltip:''
  //     },
  //     {
  //       id: 33,
  //       url: "/sales-insight",
  //       label: "Sales Insight",
  //       icon: AddchartRoundedIcon,
  //       tooltip:'High-level view of what sales trends are being seen in the automotive sector'
  //     },
  //     // {
  //     //   id: 32,
  //     //   url: "/listingOp/drafts",
  //     //   label: "Category Summary",
  //     //   icon: "",
  //     //   tooltip:'',
  //     // },
  //     // {
  //     //   id: 33,
  //     //   url: "/listingOp/drafts",
  //     //   label: "Individual Listing Info",
  //     //   icon: "",
  //     //   tooltip:'',
  //     // },
  //   ],
  // },


  // {
  //   id: 4,
  //   url: "/summary",
  //   label: "Summary",
  //   icon: SummarizeRoundedIcon,
  //   tooltip:''
  // },
  // {
  //   id: 5,
  //   url: "/sales-insight",
  //   label: "Sales Insight",
  //   icon: AddchartRoundedIcon,
  //   tooltip:'High-level view of what sales trends are being seen in the automotive sector'
  // },
  // {
  //   id: 6,
  //   url: "/communicationHub",
  //   label: "Communication Hub",
  //   icon: HubIcon,
  //   tooltip:"Area for you to ask questions, give and receive feedback"
  // },
  // {
  //   id: 7,
  //   url: "/listingOp",
  //   label: "Listing Optimization",
  //   icon: FormatListBulletedRoundedIcon,
  //   tooltip:''
  // },
  {
    id: 8,
    // url: "https://signin.ebay.com/signin?ru=https%3A%2F%2Fauth2.ebay.com%2Foauth2%2Fauthorize%3Fclient_id%3DAndrewRo-Emotived-PRD-3786bc793-b1c0583d%26redirect_uri%3DAndrew_Rowson-AndrewRo-Emotiv-hnvajdx%26scope%3Dhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.marketing.readonly%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.marketing%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.inventory.readonly%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.inventory%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.account.readonly%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.account%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.fulfillment.readonly%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.fulfillment%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.analytics.readonly%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.finances%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fsell.payment.dispute%2Bhttps%253A%252F%252Fapi.ebay.com%252Foauth%252Fapi_scope%252Fcommerce.identity.readonly%26state%3DGUID%253Ad93b19a2-ff1f-403c-b4ae-81a9ea112df4%26response_type%3Dcode%26hd&sgfl=oauth2&AppName=AndrewRo-Emotived-PRD-3786bc793-b1c0583d",
   url:"/link-your-store",
    label: "Link your Store",
    icon: PersonAddIcon,
    tooltip:''
  },
  {
    id: 9,
    url: "/priceList",
    label: "Billing",
    icon: PriceChangeIcon,
    tooltip:''
  },

  {
    id: 10,
    url: "/migrationEbayToTemu",
    label: "Migrations",
    icon: PriceChangeIcon,
    tooltip:''
  },
  {
    id: 2,
    url: "/profile",
    label: "Edit Profile",
    icon: Person4RoundedIcon,
    tooltip:''
  },
];

export const tableHeaderData: TTableHeaderData[] = [
  {
    id: 1,
    label: "Date",
  },
  {
    id: 2,
    label: "Description",
  },
  {
    id: 3,
    label: "Status",
  },
  {
    id: 4,
    label: "Action",
  },
];

export const ebayReportTableHeaderData: TTableHeaderData[] = [
  {
    id: 1,
    label: "Search date",
  },
  {
    id: 2,
    label: "Seller",
  },
  {
    id: 3,
    label: "Count",
  },
  {
    id: 5,
    label: "Title",
  },
  {
    id: 6,
    label: "Status",
  },
];

export const categoryDetailsTableHead: TTableHeaderData[] = [
  {
    id: 2,
    label: "Item ID",
  },
  {
    id: 3,
    label: "Listing Date",
  },
  {
    id: 4,
    label: "Title",
  },
 

  // {
  //   id: 6,
  //   label: "Optimization Percent",
  // },
  {
    id: 5,
    label: "Fitment",
  },
];

export const listingCategoryDetailsTableHead: TTableHeaderData[] = [
  {
    id: 2,
    label: "Item ID",
  },
  {
    id: 3,
    label: "Listing Date",
  },
  {
    id: 5,
    label: "Title",
  },
  {
    id:6,
    label:'Optimization Score'
  },
  {
    id:7,
    label:'Optimization Opportunity'
  },
  {
    id:8,
    label:'Select Optimization'
  },
];

// for migraion listings table head 
export const migrationListingCategoryDetailsTableHead: TTableHeaderData[] = [
  {
    id: 2,
    label: "Item ID",
  },
  {
    id: 3,
    label: "Listing Date",
  },
  {
    id: 5,
    label: "Title",
  },
  {
    id:6,
    label:'Optimization Score'
  },
  {
    id:7,
    label:'Optimization Opportunity'
  },
   {
    id:8,
    label:'Readiness Status'
  },
  // {
  //   id:9,
  //   label:'Migrate'
  // },
];

export const ebayReportTableData: TTableData[] = [
  {
    id: "1",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "2",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "3",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "4",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "5",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "6",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "7",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "8",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "9",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "10",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "11",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "12",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "13",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "14",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
  {
    id: "15",
    searchDate: "07-08-2024",
    seller: "auto-spares4you",
    marketplace: "UK",
    itemNumber: "115456561044",
    title: "Lorem Ipsum is simply dummy text of the printing",
    status: "Download",
  },
];

export const ebayReportHistoryHeaderData: TTableHeaderData[] = [
  {
    id: 1,
    label: "Information",
  },
  {
    id: 2,
    label: "value",
  },
];

export const ebayReportHistoryTableData: TEbayReportHistory[] = [
  {
    id: "1",
    information: "Item number",
    value: "3656656767776",
  },
  {
    id: "2",
    information: "UPC",
  },
  {
    id: "3",
    information: "EAN:",
    value: "Dose not reply",
  },
  {
    id: "4",
    information: "MPN:",
    value: "AD20HY500",
  },
  {
    id: "5",
    information: "Category ID:",
    value: "9886",
  },
  {
    id: "6",
    information: "Manufacture:",
  },
  {
    id: "7",
    information: "Brand",
    value: "blue print",
  },
  {
    id: "8",
    information: "Category title",
    value:
      "vehicle parts & accessories car parts & accessories other car parts & accessories",
  },
  {
    id: "9",
    information: "Title",
    value: "Blue print wiper blade ad20hy500 A0018200545",
  },
  {
    id: "10",
    information: "Currency",
    value: "GBP",
  },
  {
    id: "11",
    information: "Price",
    value: "14:99",
  },
  {
    id: "12",
    information: "Listing date",
    value: "01-08-2024",
  },
];

export const cities: TLocation[] = [
  {
    id: 1,
    label: "New York",
  },
  {
    id: 2,
    label: "Los Angeles",
  },
  {
    id: 3,
    label: "Chicago",
  },
  {
    id: 4,
    label: "Houston",
  },
  {
    id: 5,
    label: "Phoenix",
  },
  {
    id: 6,
    label: "Philadelphia",
  },
  {
    id: 7,
    label: "San Antonio",
  },
  {
    id: 8,
    label: "San Diego",
  },
  {
    id: 9,
    label: "Dallas",
  },
  {
    id: 10,
    label: "San Francisco",
  },
];

export const states: TLocation[] = [
  {
    id: 1,
    label: "Florida",
  },
  {
    id: 2,
    label: "Minnesota",
  },
  {
    id: 3,
    label: "Utah",
  },
  {
    id: 4,
    label: "Washington",
  },
  {
    id: 5,
    label: "Idaho",
  },
  {
    id: 6,
    label: "Nebraska",
  },
  {
    id: 7,
    label: "New Hampshire",
  },
  {
    id: 8,
    label: "Vermont",
  },
  {
    id: 9,
    label: "Iowa",
  },
  {
    id: 10,
    label: "Virginia",
  },
];

export const tagStyle: TTagStyle =
  "text-sm text-[#6C6C6C] bg-white border border-borderColor rounded-[5px] px-4 py-3";

export const optimizationTableHeaderData: TTableHeaderData[] = [
  {
    id: "1",
    label: "Item",
  },
  {
    id: "2",
    label: "Recommended",
  },
  {
    id: "3",
    label: "Used",
  },
  {
    id: "4",
    label: "Note",
  },
];

export const optimizationTableBodyData: TOptimizationTableData[] = [
  {
    id: "1",
    item: "Title",
    recommended: 80,
    used: 44,
    note: "You can maximize listing by using additional 36 characters.",
    optimizationType: "score",
  },
  {
    id: "2",
    item: "Non-Alphanumeric Characters",
    recommended: 0,
    used: 0,
    note: "Well done! You are not using non-alphanumeric characters.",
    optimizationType: "score",
  },
  {
    id: "3",
    item: "Capitalization Use",
    recommended: 7,
    used: 16,
    note: "maximize listing by removing capitals where not necessary.",
    optimizationType: "opportunity",
  },
  {
    id: "4",
    item: "Mobile Description",
    recommended: "Yes",
    used: "Yes",
    note: "Great work! Your description is mobile enabled.",
    optimizationType: "score",
  },
];

export const userTableHeaderData: TTableHeaderData[] = [
  {
    id: "1",
    label: "Customer Name",
  },
  {
    id: "2",
    label: "Company",
  },
  {
    id: "3",
    label: "Phone Number",
  },
  {
    id: "4",
    label: "Email",
  },
  {
    id: "5",
    label: "Country",
  },
  {
    id: "6",
    label: "Status",
  },
];

export const userTableBodyData: TUserTable[] = [
  {
    id: "1",
    name: "Jane Cooper",
    company: "Microsoft",
    phone: "(225) 555-0118",
    email: "jane@microsoft.com",
    country: "United States",
    status: "Active",
  },
  {
    id: "2",
    name: "Floyd Miles",
    company: "Yahoo",
    phone: "(205) 555-0100",
    email: "floyd@yahoo.com",
    country: "Kiribati",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Jane Cooper",
    company: "Microsoft",
    phone: "(225) 555-0118",
    email: "jane@microsoft.com",
    country: "United States",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Floyd Miles",
    company: "Yahoo",
    phone: "(205) 555-0100",
    email: "floyd@yahoo.com",
    country: "Kiribati",
    status: "Active",
  },
  {
    id: "5",
    name: "Jane Cooper",
    company: "Microsoft",
    phone: "(225) 555-0118",
    email: "jane@microsoft.com",
    country: "United States",
    status: "Active",
  },
  {
    id: "6",
    name: "Floyd Miles",
    company: "Yahoo",
    phone: "(205) 555-0100",
    email: "floyd@yahoo.com",
    country: "Kiribati",
    status: "Active",
  },
  {
    id: "7",
    name: "Floyd Miles",
    company: "Yahoo",
    phone: "(205) 555-0100",
    email: "floyd@yahoo.com",
    country: "Kiribati",
    status: "Active",
  },
  {
    id: "8",
    name: "Ronald Richards",
    company: "Google",
    phone: "(302) 555-0107",
    email: "ronald@adobe.com",
    country: "Brazil",
    status: "Inactive",
  },
];

export const optimizationTableTwoHeaderData: TTableHeaderData[] = [
  {
    id: "1",
    label: "Item Specifics",
  },
  {
    id: "2",
    label: "Item",
  },
  {
    id: "3",
    label: "Value",
  },
];

export const optimizationTableThreeHeaderData: TTableHeaderData[] = [
  {
    id: "1",
    label: "Year",
  },
  {
    id: "2",
    label: "Make",
  },
  {
    id: "3",
    label: "Model",
  },
  {
    id: "4",
    label: "Trim",
  },
  {
    id: "5",
    label: "Engine",
  },
];

export const optimizationTableThreeBodyData: TOptimizationTableThreeBodyData[] =
  [
    {
      id: "1",
      year: 1986,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "2",
      year: 1987,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "3",
      year: 1987,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "4",
      year: 1987,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "5",
      year: 1988,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "6",
      year: 1988,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "7",
      year: 1988,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "8",
      year: 1989,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "9",
      year: 1989,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "10",
      year: 1989,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "11",
      year: 1990,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "12",
      year: 1990,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
    {
      id: "13",
      year: 1990,
      make: "Aqura",
      model: "Legend",
      trim: "",
      engine: "2493cc 113KW 153HP C27A1",
    },
  ];

export const dashboardTableHeaderData: TTableHeaderData[] = [
  {
    id: 1,
    label: "Ebay Seller",
  },
  {
    id: 2,
    label: "Listings",
  },
  {
    id: 3,
    label: "Processed",
  },
  {
    id: 4,
    label: "Optimized",
  },
];

export const dashboardTableBodyData: TDashboardTableBodyData[] = [
  {
    id: "1",
    description: "Listings downloading",
    date: "20-02-2023",
    status: "Active",
    action: "View",
  },
];
