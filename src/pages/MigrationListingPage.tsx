import { migrationListingCategoryDetailsTableHead } from "../utils/data";
import { useParams, useNavigate, useLocation } from "react-router";
import {
  useSummaryFitmentDetailsMutation,
  // useFitmentOptimizedMutation,
} from "../Redux/features/summary/summaryApi";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Backdrop

} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import MigrationListingTable from "./MigrationListingTable";



interface ShippingTemplate {
  templateId: string;
  templateName: string;
}

const MigrationListingPage = () => {
  const { id, categoryId, site } = useParams();
  const [getFitmentDetails, { data, isLoading, isSuccess, isError }] =
    useSummaryFitmentDetailsMutation();
  // const [, { isLoading: isOptimizing }] =
  //   useFitmentOptimizedMutation();
  const [bodyItems, setBodyItems] = useState<any[]>([]);
  // const [, setSelectedItems] = useState<number[]>([]);
  const [currentPage] = useState(() => 1); // avoids inference warning
  const [, setTotalPages] = useState<number>(1);
  const [open, setOpen] = useState(false);
  // const listingOptimizationScore = useSelector(
  //   (state: RootState) =>
  //     state.setListingOptimizationScore.listingOptimizationScore ?? 0
  // );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  //   const [, setIsModalOpen] = useState(false);
  // const [, setOptimizeRequestId] = useState(0);
  // const [, setTotalAmountString] = useState("");
  // const [, setDueNowString] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  // const [, { isLoading: isOptimizing }] = useFitmentOptimizedMutation();
  const [optimizationSelections, setOptimizationSelections] = useState<{
    [listingId: string | number]: string[]; // or number if IDs are numbers
  }>({});
  const [couponCode] = useState("");
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [openLPDialog, setOpenLPDialog] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const listings = location.state?.listings || [];
  // const [validationListingStatus, setValidationListingStatus] = useState<{
  //   [key: string]: string;
  // }>({});
  const [, setTableData] = useState<any[]>([]);
  // const DEFAULT_OPTIMIZATION_TYPE = "Item Specifics";
  const navigate = useNavigate();
  const [storeMigrationId, setStoreMigrationId] = useState<string | null>(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [migrationCount, setMigrationCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<ShippingTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ShippingTemplate | null>(null);
    const [successOpen, setSuccessOpen] =useState(false);
    const [, setValidationLoading] =
  useState(true);
  const [templateLoading, setTemplateLoading] =
  useState(true);
  const [snackbarOpen, setSnackbarOpen] =
  useState(false);
const [snackbarMessage, setSnackbarMessage] =
  useState("");
const [snackbarSeverity, setSnackbarSeverity] =
  useState<"success" | "error">(
    "success"
  );



  // const handleCheckout = () => {
  //   setOpen(true); // open the dialog instead of redirecting
  // };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleInputChange = (e: any) => {
  //   const { name, value } = e.target;

  //   setState((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleInputFocus = (e: any) => {
  //   setState((prev) => ({ ...prev, focus: e.target.name }));
  // };

  // const handlePayClick = async () => {
  //   try {
  //     // const result = await acceptOptimize({
  //     //   searchId: optimizeRequestId,
  //     // }).unwrap();
  //   } catch (error) {
  //     console.error("Error optimizing:", error);
  //   }
  //   setIsModalOpen(false);
  // };

  const pageSize = 100;

  useEffect(() => {
    getFitmentDetails({
      searchResultId: id,
      pageNo: currentPage,
      pageSize,
      categoryId,
      site,
    });
  }, [id, getFitmentDetails, currentPage, pageSize]);

  useEffect(() => {
    if (isSuccess && data) {
      setBodyItems(data || []);
      const totalItems = data.totalItems || data.length;
      setTotalPages(Math.ceil(totalItems / pageSize));
    }
  }, [data, isSuccess]);

  useEffect(() => {
    fetchShippingTemplates();
  }, []);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  // const handleOptimize = async () => {
  //   try {
  //     const result = await optimizeFitment({
  //       all: false,
  //       ids: selectedItems,
  //       categoryId: categoryId,
  //       site: site,
  //       searchId: id,
  //     }).unwrap();
  //     if (result) {
  //       setTotalAmountString(result?.totalCostString);
  //       setOptimizeRequestId(result?.optimizeRequestId);
  //       setDueNowString(result?.dueNowString);
  //       setIsModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error optimizing:", error);
  //   }
  // };

  // const handleOptimizeAll = async () => {
  //   try {
  //     const result = await optimizeFitment({
  //       all: true,
  //       ids: selectedItems,
  //       categoryId: categoryId,
  //       site: site,
  //       searchId: id,
  //     }).unwrap();
  //     if (result) {
  //       setTotalAmountString(result?.totalCostString);
  //       setOptimizeRequestId(result?.optimizeRequestId);
  //       setDueNowString(result?.dueNowString);
  //       setIsModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error optimizing:", error);
  //   }
  // };

  //stripe publising key here
  const stripePromise = loadStripe("pk_live_arybZQDhMxwpvEOWhEgeqLF5");

  // Strip checkout logic here
  // const handleCheckout = () => {
  //   window.open("https://emotivonline.com/contact/", "_blank", "noopener,noreferrer");
  // };

  // const openDialogBox = () => {
  //   setOpenDialog(true);
  // };

  const handleCheckout = async () => {

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://api.help-on-time.com/api/datacube/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            all: true,
            ids: selectedItems,
            categoryId: categoryId,
            site: site,
            searchId: id,
            coupon: couponCode || null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const session = await response.json(); // Get session ID from backend

      const stripe = await stripePromise;

      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
      setOpenDialog(false);

      await stripe.redirectToCheckout({ sessionId: session.sessionId }); // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  // new code when optimization type has not selected
  // const optimizationTypes = selectedItems.reduce((acc: any, itemId: any) => {
  //   const key = String(itemId);
  //   const selectedTypes = optimizationSelections[key];

  //   acc[key] =
  //     selectedTypes && selectedTypes.length > 0
  //       ? selectedTypes
  //       : [DEFAULT_OPTIMIZATION_TYPE];

  //   return acc;
  // }, {});

  // working code and it is commented temporairly
  // const handleCheckoutForSelectedItems = async () => {

  //   if (!couponCode.trim()) {
  //     setOpenCouponDialog(true);
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("accessToken");

  //     const payload = {
  //       all: false,
  //       ids: selectedItems,
  //       categoryId: categoryId,
  //       site: site,
  //       searchId: id,
  //       coupon: couponCode || null,
  //       optimizationTypes: selectedItems.reduce((acc: any, itemId: any) => {
  //         const key = String(itemId);
  //         acc[key] = optimizationSelections[key] || [];
  //         return acc;
  //       }, {}),
  //     };


  //     const response = await fetch(
  //       "https://api.help-on-time.com/api/datacube/create-checkout-session",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           all: false,
  //           ids: selectedItems,
  //           categoryId: categoryId,
  //           site: site,
  //           searchId: id,
  //           coupon: couponCode || null,
  //           optimizationTypes: selectedItems.reduce((acc: any, itemId: any) => {
  //             acc[itemId] = optimizationSelections[itemId] || [];
  //             return acc;
  //           }, {}),
  //         }),
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const session = await response.json(); // Get session ID from backend

  //     const stripe = await stripePromise;

  //     if (!stripe) {
  //       console.error("Stripe failed to load.");
  //       return;
  //     }

  //     if (session.free) {
  //       navigate("/payment-success-page");
  //       return;
  //     }
  //     await stripe.redirectToCheckout({ sessionId: session.sessionId }); // Redirect to Stripe Checkout
  //   } catch (error) {
  //     console.error("Checkout failed:", error);
  //   }
  // };

  // letst code for migratuion
  // useEffect(() => {
  //   const validateMigration = async () => {

  //     const token = localStorage.getItem("accessToken");
  //     try {
  //       const response = await fetch(
  //         `http://localhost:4000/api/v1/migrations/validate`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             listings: bodyItems.map((item: any) => ({
  //               sourceListingId: String(item.id),
  //             })),
  //           }),
  //         },
  //       );

  //       const data = await response.json();

  //       const statusMap: { [key: string]: string } = {};

  //       data.items.forEach((item: any) => {
  //         const key = String(item.sourceListingId).trim();
  //         statusMap[key] = item.status;
  //       });


  //       setBodyItems((prev: any[]) =>
  //         prev.map((item) => {
  //           const key = String(item.id).trim(); // ✅ MUST match API

  //           const status = statusMap[key];

  //           //   key,
  //           //   status,
  //           // });

  //           return {
  //             ...item,
  //             status: status || "NOT_READY",
  //           };
  //         }),
  //       );
  //     } catch (error) {
  //       console.error("Error calling API:", error);
  //     }
  //   };
  //   validateMigration();
  // }, [bodyItems.length]);

  useEffect(() => {
  const validateMigration = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      setValidationLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/migrations/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listings: bodyItems.map((item: any) => ({
              sourceListingId: String(item.id),
            })),
          }),
        }
      );

      const data = await response.json();

      const statusMap: {
        [key: string]: string;
      } = {};

      data.items.forEach((item: any) => {
        const key = String(
          item.sourceListingId
        ).trim();

        statusMap[key] = item.status;
      });

      setBodyItems((prev: any[]) =>
        prev.map((item) => {
          const key = String(item.id).trim();

          return {
            ...item,
            status:
              statusMap[key] || "NOT_READY",
          };
        })
      );
    } catch (error) {
      console.error(
        "Error calling API:",
        error
      );
    } finally {
      setValidationLoading(false);
    }
  };

  if (bodyItems.length > 0) {
    validateMigration();
  }
}, [bodyItems.length]);

  // useEffect(() => {
  //   if (!listings.length) return;

  //   const validateMigration = async () => {
  //     try {

  //         const token = localStorage.getItem("accessToken");

  //       const response = await fetch(
  //         `http://localhost:4000/api/v1/migrations/validate?sellerId=${sellerId}`,
  //         {
  //           method: "POST",
  //            headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             listings: listings.map((item:any) => ({
  //               sourceListingId: String(item.id),
  //             })),
  //           }),
  //         }
  //       );

  //       const data = await response.json();

  //       const statusMap: { [key: string]: string } = {};

  //       data.items.forEach((item: any) => {
  //         statusMap[item.sourceListingId] = item.status;
  //       });

  //       setValidationListingStatus(statusMap); // ✅ store clean data

  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   validateMigration();
  // }, [listings]);

  useEffect(() => {
    if (listings && listings.length > 0) {
      setTableData((prev: any) => {
        const newItems = listings.filter(
          (newItem: any) => !prev.some((item: any) => item.id === newItem.id),
        );
        return [...newItems, ...prev];
      });
    }
  }, [listings]);

  // TEMP FIX: Showing dialog instead of checkout
  // LP is not available in this plan

  // const handleTempLPClick = () => {
  //   setOpenLPDialog(true);
  // };

  // api for sending migration
  const submitMigration = async () => {
    const token = localStorage.getItem("accessToken");

    // Get saved accounts
    const savedAccounts = localStorage.getItem("accountsData");

    const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];

    // Find account with provider = temu
    const temuAccount = accounts.find(
      (account: any) => account.provider === "TEMU",
    );

    // If not found
    if (!temuAccount) {
      console.error("coolrims account not found");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/migrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId: temuAccount.accountId,
          sellerId: temuAccount.sellerId,
          listings: selectedItems.map((item: any) => ({
            sourceListingId: String(item),
          })),
        }),
      });
      // ❗ handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Migration failed");
      }

      const data = await response.json();
      // const migrationId = data?.migrationId;
      return data; // should contain migrationId
    } catch (error) {
      console.error("Migration submit error:", error);
      throw error;
    }
  };

  // sending migrationid to quque
  const handleStartMigration = async () => {
    setIsSubmitting(true);
    try {
      // ✅ call submit API
      const res = await submitMigration();


      const migrationId = res?.migrationId;

      if (!migrationId) {
        console.error("migrationId not found");
        return;
      }
      // ✅ migrationId here
      setStoreMigrationId(migrationId);
      localStorage.setItem("migrationId", migrationId);

      // ✅ store count
      setMigrationCount(selectedItems.length);

      // ✅ open dialog
      setOpenSuccessDialog(true);

      // pollling started
      startPolling(migrationId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // 🔵 stop loading
    }
  };

  //polling API
  const getMigrationStatus = async (migrationId: string) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/migrations/${migrationId}`, // ✅ USED HERE
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    return data;
  };

  //polling function
  const startPolling = (migrationId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await getMigrationStatus(migrationId);


        const status = data?.status;

        if (
          status === "COMPLETED" ||
          status === "FAILED" ||
          status === "PARTIAL_FAILED"
        ) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
        clearInterval(interval);
      }
    }, 3000);
  };

  // show job details
  const getAllMigrations = async (page = 1, limit = 10, status = "ALL") => {
    const token = localStorage.getItem("accessToken");

    try {
      // ✅ build query params dynamically
      let url = `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/migrations?page=${page}&limit=${limit}`;

      if (status !== "ALL") {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch migrations");
      }

      const data = await response.json();

      return data; // return full response (items + meta)
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  //handle job details click
  const handleJobDetailsClick = async () => {
    try {
      const migrations = await getAllMigrations();


      if (migrations.length === 0) {
        console.warn("No migration jobs found");
        return;
      }

      // ✅ store full list
      localStorage.setItem("migrations", JSON.stringify(migrations));

      // ✅ navigate to jobs list page
      navigate("/migration-job-details", {
        state: { migrations },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // fetch templates
  const fetchShippingTemplates = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      setTemplateLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/shipping-template`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

 setTemplates(data.templates || []);
      if (data.selectedShippingTemplate) {
      setSelectedTemplate(
        data.selectedShippingTemplate
      );


      // Save in localStorage also
      localStorage.setItem(
        "shippingTemplateId",
        data.selectedShippingTemplate.templateId
      );

      // Close popup
      setOpenDialog(false);
    }

    // =====================================
    // IF NO TEMPLATE SELECTED
    // =====================================

    else {
      setSelectedTemplate(null);

      // Open popup automatically
      setOpenDialog(true);
    }

    } catch (error) {
      console.error("Error fetching shipping templates:", error);
    } finally {
      setLoading(false);
       setTemplateLoading(false);
    }
  };

// const handleTemplateSelect = (template: any) => {
//   setSelectedTemplate(template);

//   localStorage.setItem(
//     "shippingTemplateId",
//     template.templateId
//   );

//   setOpenDialog(false);
// };

const handleTemplateSelect = async (
  template: ShippingTemplate
) => {
  try {
    const token = localStorage.getItem("accessToken");

    // setLoading(true);
    setTemplateLoading(true);

    // =====================================
    // SAVE TEMPLATE API
    // =====================================

    const response = await fetch(
      `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/shipping-template/select/${template.templateId}`,
      {
        method: "PATCH",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // if (!response.ok) {
    //   throw new Error(
    //     "Failed to save shipping template"
    //   );
    // }

       if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to save shipping template"
      );
    }

    // =====================================
    // SAVE LOCALLY
    // =====================================

    setSelectedTemplate(template);

    localStorage.setItem(
      "shippingTemplateId",
      template.templateId
    );

    // =====================================
    // CLOSE DIALOG
    // =====================================

    setOpenDialog(false);

    // =====================================
    // SUCCESS MESSAGE
    // =====================================

setSnackbarMessage(
      "Shipping template saved successfully"
    );

    setSnackbarSeverity("success");

    setSnackbarOpen(true);
  } catch (error:any) {
    console.error(
      "Error saving shipping template:",
      error
    );

     setSnackbarMessage(
      error.message ||
        "Failed to save shipping template"
    );

    setSnackbarSeverity("error");

    setSnackbarOpen(true);
  } finally {
    // setLoading(false);
    setTemplateLoading(false);
  }
};

  const handleChangeTemplate = () => {
    // fetchShippingTemplates();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (isError) return <div>Error loading data</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-col gap-[10px] p-[25px] relative w-full">
        {/* Top Section: CircularProgress + Fitments + Back Button */}
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-[30px]">
            <div className="flex flex-col gap-6">
              {/* CircularProgressBar on Left */}
              {/* <div className="border  border-borderColor rounded-[15px] p-2.5 w-[280px] h-[320px]">
                <p className="text-md font-semibold text-[#0F0C22] text-center font-poppins">
                  Listing Optimization
                </p>
                <ListingOptimizationScore
                  percentage={listingOptimizationScore}
                />
              </div> */}

              {/* fitment category score chart */}
              {/* <div className="border  border-borderColor p-2.5 w-[280px] h-[320px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <ListingCountryCategoryOptimizationScoreChart />
              </div> */}
            </div>

            {/* Right Side: Fitments, Tooltip & Buttons */}
            <div className="flex flex-col gap-3 w-full">
              {/* Typography with Tooltip */}
              <div className="flex items-center justify-between gap-3">
                {/* <h6 className="font-medium font-poppins">Fitments</h6>
                <Tooltip title="info" color="white">
                  <InfoIcon style={{ fontSize: 11, color: "grey" }} />
                </Tooltip> */}
                <button
                  onClick={() => navigate(-1)}
                  className="ml-auto flex items-center justify-center text-xs gap-1 text-secondary bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              </div>

              {/* Optimize Buttons */}
              <div className="flex items-center justify-between w-full">
                {/* Optimize Buttons Container */}
                <div className="flex gap-2">
                  {/* <button
                    // onClick={handleOptimize}
                    onClick={handleCheckoutForSelectedItems}
                    // className={`max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins  rounded-[5px] border flex items-center border-gray-400 text-red-600 gap-2 transition-all duration-200 ease-in-out
                    //   ${
                    //     selectedItems.length < 1 || selectedItems.length > 5 || isOptimizing
                    //       ? "bg-gray-300 border-gray-400 text-red-600 cursor-not-allowed"
                    //       : "bg-[#2e6f40] hover:bg-green-700 border-green-700"
                    //   }
                    //   `
                    // }
                    className={`max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins  rounded-[5px] border flex items-center bg-gray-300 border-gray-400 text-red-600 gap-2 transition-all duration-200 ease-in-out
          
                      `}
                    // disabled={isOptimizing}
                    // disabled={
                    //   selectedItems.length < 1 || selectedItems.length > 5 || isOptimizing
                    // }
                    // disabled
                  >
                    <Tooltip title="Add selected items for Listing Optimization">
                      <span>{isOptimizing ? "Optimizing..." : "Optimize"}</span>
                    </Tooltip>
                  </button> */}
                  {/* <button
                    // onClick={handleOptimizeAll}
                    onClick={openDialogBox}
                    className="max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins bg-gray-300 border-gray-400 text-red-600 rounded-[5px] border flex items-center gap-2"
                    // disabled={isOptimizing}
                    // disabled
                  >
                    <Tooltip title="Apply Listing Optimization to All Items">
                      <span>
                        {isOptimizing ? "Optimizing..." : "Optimize All"}
                      </span>
                    </Tooltip>
                  </button> */}

                  {/* lateest code for migration */}
                  <button
                    onClick={handleStartMigration}
                    disabled={isSubmitting}
                    className={`px-3 py-1.5 text-xs font-medium font-poppins rounded-[5px] transition-all
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-500 text-white hover:bg-blue-600"
    }
  `}
                  >
                    {isSubmitting ? "Migrating..." : "Migrate Selected"}
                  </button>

                  {/* new button for start polling */}
                  {/* <button
       onClick={handleStartMigration}
      className="px-3 py-1.5 text-xs font-medium font-poppins bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-all"
    >
     check queue status
    </button> */}

                  <button
                    onClick={handleJobDetailsClick}
                    className="px-3 py-1.5 text-xs font-medium font-poppins bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-all"
                  >
                    Job Details
                  </button>

                  <span className="text-[11px] text-gray-600 leading-tight mt-2">
                    Please select listings for migration, and then click button.
                  </span>
                </div>

                {/* Back Button on Extreme Right */}
                {/* <button
                  onClick={() => navigate(-1)}
                  className="ml-auto flex items-center justify-center text-xs gap-1 text-secondary bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft size={15} /> Back
                </button> */}

                <div>
                <Box sx={{ padding: "20px" }}>
  {templateLoading ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "10px 0",
      }}
    >
      <CircularProgress size={20} />

      <Typography>
        Loading shipping template...
      </Typography>
    </Box>
  ) : selectedTemplate ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2,
        gap: 2,
      }}
    >
      <Typography mt={0}>
        <strong>Template ID:</strong>{" "}
        {selectedTemplate?.templateId}
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 0 }}
        onClick={handleChangeTemplate}
      >
        Change Template
      </Button>
    </Box>
  ) : (
    <Box>
      <Typography mb={2}>
        No shipping template selected
      </Typography>

      <Button
        variant="contained"
        onClick={handleChangeTemplate}
      >
        Select Shipping Template
      </Button>
    </Box>
  )}

  <Dialog
    open={openDialog}
    onClose={handleCloseDialog}
  >
    <DialogTitle>
      Please Select Shipping Template
    </DialogTitle>

    <DialogContent>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : templates.length > 0 ? (
        <List>
          {templates.map((template) => (
            <ListItemButton
              key={template.templateId}
              onClick={() =>
                handleTemplateSelect(template)
              }
            >
              <ListItemText
                primary={template.templateName}
                secondary={`Template ID: ${template.templateId}`}
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>
          No templates available
        </Typography>
      )}
    </DialogContent>
  </Dialog>
</Box>

                </div>
              </div>

              <div className="mt-1 w-full">
                <MigrationListingTable
                  headerItems={migrationListingCategoryDetailsTableHead}
                  bodyItems={bodyItems}
                  onSelectItemsChange={setSelectedItems}
                  onOptimizeAll={handleCheckout}
                  optimizationSelections={optimizationSelections}
                  setOptimizationSelections={setOptimizationSelections}
                  //  validationStatusMap={validationListingStatus}
                />

                <div className="flex w-full justify-between items-center mt-5">
                  {/* <div className="flex gap-3">
                    <button
                      onClick={handleOptimize}
                      className="max-w-[120px] px-3 py-1.5 text-xs font-medium font-poppins text-white bg-[#2e6f40] rounded-[5px] border border-borderGreen flex items-center gap-2"
                      disabled={isOptimizing}
                    >
                      <Tooltip title="Add selected items to have fitment adopted ">
                        <span> {isOptimizing ? "Adopting." : "Adopt"}</span>
                      </Tooltip>
                    </button>
                    <button
                      onClick={handleOptimizeAll}
                      className="max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins text-white bg-[#2e6f40] rounded-[5px] border border-borderGreen flex items-center gap-2"
                      disabled={isOptimizing}
                    >
                      <Tooltip
                        title="Add fitment to all items 

"
                      >
                        <span> {isOptimizing ? "Adopting." : "Adopt All"}</span>
                      </Tooltip>
                    </button>
                  </div> */}

                  {/* Right: Pagination */}
                  {/* <div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Table & Pagination */}
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
                maxWidth: "450px",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <DialogTitle
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1F2937",
                  pb: 0,
                }}
              >
                Listing Optimization Help
              </DialogTitle>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                color: "#4B5563",
                mt: 1,
              }}
            >
              <Typography>
                {/* Need help improving your listings?{" "} */}
                <strong>
                  Our team can optimize them for better visibility and
                  performance.
                </strong>{" "}
                Just{" "}
                <Link
                  href="https://emotivonline.com/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    fontWeight: 500,
                    color: "#2563EB",
                  }}
                >
                  get in touch with us
                </Link>{" "}
                and we’ll take care of the rest.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ pt: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  borderRadius: "10px",
                  borderColor: "#9CA3AF",
                  color: "#374151",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                    borderColor: "#6B7280",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* dialogue for optimization all */}
        {/* <div>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                p: 2,
                textAlign: "center",
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="error">
             Select all listings for migration
              </Typography>
            </DialogTitle>


            <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
              <Button
                onClick={() => setOpenDialog(false)}
                variant="contained"
                sx={{
                  px: 4,
                  borderRadius: 2,
                  color: "black",
                  backgroundColor: "#fff",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckout}
                variant="contained"
                sx={{ px: 4, borderRadius: 2, backgroundColor: "#EB232E" }}
              >
                Migrate All Listings
              </Button>
            </DialogActions>
          </Dialog>
        </div> */}

        {/* dialogue for alert if coupon code is not write */}
        <Dialog
          open={openCouponDialog}
          onClose={() => setOpenCouponDialog(false)}
        >
          <DialogTitle>Coupon Code Required</DialogTitle>

          <DialogContent>
            <p className="text-sm text-gray-700">
              Please enter a coupon code before submitting.
            </p>
          </DialogContent>

          <DialogActions>
            <button
              onClick={() => setOpenCouponDialog(false)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
          </DialogActions>
        </Dialog>

        {/* dialog for temp fix saying LP is not availablbe in this plan */}

        <div>
          <Dialog
            open={openLPDialog}
            onClose={() => setOpenLPDialog(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Feature Not Available</DialogTitle>

            <DialogContent>
              <Typography variant="body2">
                Listing Optimization is not available in this plan
              </Typography>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                onClick={() => setOpenLPDialog(false)}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* popup/dilogur for successful migration */}
        <Dialog
          open={openSuccessDialog}
          onClose={() => setOpenSuccessDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Migration Started Successfully
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Typography>
              {migrationCount} item{migrationCount > 1 ? "s" : ""} have been
              selected and sent for migration.
            </Typography>

            <Typography sx={{ mt: 2 }}>
              You can monitor the progress in the Job Details section.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center" }}>
            <Button onClick={() => setOpenSuccessDialog(false)}>Close</Button>

            <Button
              variant="contained"
              onClick={() => {
                setOpenSuccessDialog(false);
                navigate(`/migration-details/${storeMigrationId}`);
              }}
            >
              View Job Details
            </Button>
          </DialogActions>
        </Dialog>

<div>
    <Snackbar
  open={successOpen}
  autoHideDuration={3000}
  onClose={() => setSuccessOpen(false)}
  anchorOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
>
  <Alert
    severity="success"
    variant="filled"
  >
    Shipping template saved successfully
  </Alert>
</Snackbar>
</div>

{/* snacbar alert backdrop loading  */}
<div>
  <Backdrop
  open={templateLoading}
  sx={{
    color: "#fff",
    zIndex: 9999,
  }}
>
  <CircularProgress color="inherit" />
</Backdrop>

<Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() =>
    setSnackbarOpen(false)
  }
  anchorOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
>
  <Alert
    onClose={() =>
      setSnackbarOpen(false)
    }
    severity={snackbarSeverity}
    variant="filled"
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
</div>
      </div>
    </div>


  );
};

export default MigrationListingPage;
