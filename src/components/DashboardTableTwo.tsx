import { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { TDashboardTableBodyData, TTableHeaderData } from "../utils/types";
import { downloadReport } from "../utils/downloadHelper";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import IconButton from "@mui/material/IconButton";
import {
  Dialog,
  Tooltip,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";

type TTableProps = {
  headerItems: TTableHeaderData[];
  bodyItems: TDashboardTableBodyData[];
};

interface TableRow {
  status: string;
  action: string;
  id: string;
}

const DashboardTableTwo = ({ bodyItems, headerItems }: TTableProps) => {
  const [, setIsUploading] = useState(false);

  

  const extendedHeaders = useMemo(() => {
    const hasAction = headerItems.some(
      ({ label }) => label.toLowerCase() === "action"
    );
    return hasAction ? headerItems : [...headerItems, { label: "Action" }];
  }, [headerItems]);

  // this is to define coloumns and rows for materialReactTable
  //  @ts-ignore
  const columns = useMemo(() => {
    return extendedHeaders.map(({ label }) => ({
      accessorKey: label.toLowerCase(), // this key should match with keys of body
      header: label,
      Cell:
      label === "Status"
        ? ({ row }: { row: { original: TableRow } }) => {
            return (
              <Tooltip enterDelay={0} title="Track the progress of fitment adoption: After selecting non-fitments and completing the payment, the Emotiv team will receive the file that requires fitment adoption. The status will initially change to 'Not Started'. Once the team begins working on the file, the status will update to 'In Progress'. After the adoption work is completed, the status will change to 'Completed', and the revised file will be available for you to download and approve.">
                <div
                  style={{
                    backgroundColor:
                      row.original.status === "In Progress"
                        ? "green"
                        : row.original.status === "Completed"
                        ? "gray"
                        : "red",
                    width: "6rem",
                    padding: "4px",
                    color: "white",
                    borderRadius: "1px",
                    textAlign: "center",
                    cursor: "default", // optional: shows it's not clickable
                  }}
                >
                  {row.original.status}
                </div>
              </Tooltip>
            );
          }
      
          : label === "Action"
          ? ({ row }: { row: { original: TableRow } }) => {
              const { action, id } = row.original;
              const [showDialog, setShowDialog] = useState(false);
              const [file, setFile] = useState<File | null>(null);
              const isAdmin = localStorage.getItem("isAdmin") === 'true' ? true : false;
              
              const [uploadMessage, setUploadMessage] = useState<string | null>(
                null
              );
              const [showSnackbar, setShowSnackbar] = useState(false);
              const [approvalMessage, setApprovalMessage] = useState("");

              // api call for approval
              const handleApprove = async () => {
                try {
                  const token = localStorage.getItem("accessToken");
                  const timestamp = Date.now();
                  const response = await fetch(
                    `${
                      import.meta.env.VITE_BASE_API_KEY
                    }/fitment/listing/approve?id=${id}&time=${timestamp}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (response.ok) {
                    setApprovalMessage(
                      "✅ Request has been approved successfully."
                    );
                  } else {
                    setApprovalMessage("⚠️ Approval failed. Please try again.");
                  }
                } catch (err) {
                  console.error("Approval failed:", err);
                  setApprovalMessage(
                    "❌ Something went wrong. Please try again later."
                  );
                }
              };

              // api call to upload file by admin
              const handleFileChange = async (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                const selectedFile = e.target.files?.[0];
                if (!selectedFile) return;

                setFile(selectedFile);
                setIsUploading(true); 

                const formData = new FormData();
                formData.append("file", selectedFile);

                try {
                  const token = localStorage.getItem("accessToken");

                  const response = await fetch(
                    `${
                      import.meta.env.VITE_BASE_API_KEY
                    }/fitment/listing/upload?id=${id}`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        // DO NOT manually set "Content-Type" here
                      },
                      body: formData,
                    }
                  );

                  if (!response.ok) throw new Error("Upload failed");

                  const result = await response.json();

                  setUploadMessage(
                    result.message || "File uploaded successfully!"
                  );
           
                } catch (error) {
                  setUploadMessage("Upload failed. Please try again.");
                 
                }finally{
                  setIsUploading(false); 
                  setShowSnackbar(true);
                }
              };

              // close dialog box
              const handleCloseDialog = () => {
                setShowDialog(false);
                setApprovalMessage("");
              };

              if ( (action === "Download" && row.original.status === "Completed"  )) {
                return (
                  <Box
                    display="flex"

                    justifyContent="space-evenly"
                    alignItems="center"
                    width="100%"
                  >
                    {/* Download and Approve buttons */}
                    {(row.original.status === "Completed") && (
                      <>
                        <Tooltip title="Download the completed report" enterDelay={0} leaveDelay={100}>
                          <IconButton onClick={() => downloadReport(id)}>
                            <FileDownloadIcon color="info" />
                          </IconButton>
                        </Tooltip>
              
                        <Tooltip title="Approve the fitment adoption" enterDelay={0} leaveDelay={100}>
                          <IconButton onClick={() => setShowDialog(true)}>
                            <CheckCircleIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
              
                    {/* Upload button - only for Admin */}
                    {isAdmin && (
                    
                      <>
                   
                        <input
                          type="file"
                          id={`upload-${id}`}
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                        <label htmlFor={`upload-${id}`}>
                          <Tooltip title="Admin can upload the revised file" enterDelay={0} leaveDelay={100}>
                            <IconButton component="span">
                              <UploadFileIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </label>
                        {file && (
                          <Typography variant="body2" fontSize={12} sx={{ ml: 1 }}>
                            {file.name}
                          </Typography>
                        )}
                      </>
                    )}
              
                    {/* Dialog for Approve confirmation */}
                    <Dialog open={showDialog} onClose={handleCloseDialog}>
                      <DialogTitle>Confirm Approval</DialogTitle>
                      <DialogContent>
                        {approvalMessage ? (
                          <Typography>{approvalMessage}</Typography>
                        ) : (
                          <Typography>
                            Please check the downloaded report. If you're satisfied with the fitment adoptions,
                            click the 'Approve' button. This will automatically update your eBay listings with the new fitment information.
                          </Typography>
                        )}
                      </DialogContent>
                      <DialogActions>
                        {!approvalMessage ? (
                          <>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={handleApprove} color="primary">
                              Approve
                            </Button>
                          </>
                        ) : (
                          <Button onClick={handleCloseDialog} color="primary">
                            Close
                          </Button>
                        )}
                      </DialogActions>
                    </Dialog>
              
                    {/* Snackbar for Upload result */}
                    <Snackbar
                      open={showSnackbar}
                      autoHideDuration={9000}
                      onClose={() => setShowSnackbar(false)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                    >
                      <Alert
                        onClose={() => setShowSnackbar(false)}
                        severity={uploadMessage?.includes("successfully") ? "success" : "error"}
                        sx={{
                          width: "100%",
                          maxWidth: 600,         // Make it wider
                          fontSize: "1rem",      // Increase text size
                          padding: "16px 24px",  // Add padding
                        }}
                      >
                        {uploadMessage}
                      </Alert>
                    </Snackbar>
                  </Box>
                );
              } else {
                return null;
              }
              

//               return action === "Download" && row.original.status === "Completed" ?  (
//                 <Box
//                   display="flex"
//                   justifyContent="space-evenly"
//                   alignItems="center"
//                   width="100%"
//                 >
//                   <Tooltip
//   title="You can download the Fitment Adoption Report once our team has completed the adoption process."
//   enterDelay={0} // Removes the delay when showing the tooltip
//   leaveDelay={100} // Optional: control the delay when hiding the tooltip
// >
//   <IconButton onClick={() => downloadReport(id)}>
//     <FileDownloadIcon color="info" />
//   </IconButton>
// </Tooltip>

// <Tooltip
//   title="Click 'Approve' to confirm the fitment adoption and automatically update your eBay listings."
//   enterDelay={0} // Removes the delay when showing the tooltip
//   leaveDelay={100} // Optional: control the delay when hiding the tooltip
// >
//   <IconButton onClick={() => setShowDialog(true)}>
//     <CheckCircleIcon color="success" />
//   </IconButton>
//   </Tooltip>

//                   {isAdmin  && (
//                     <>
//                       <input
//                         type="file"
//                         id={`upload-${id}`}
//                         style={{ display: "none" }}
//                         onChange={handleFileChange}
//                       />
//                       <label htmlFor={`upload-${id}`}>
//   <Tooltip
//     title="Once the adoption work on non-fitments is completed, the admin can upload the revised file here."
//     enterDelay={0} // Removes delay when showing tooltip
//     leaveDelay={100} // Optional: control the delay when hiding tooltip
//   >
//     <IconButton component="span">
//       <UploadFileIcon color="secondary" />
//     </IconButton>
//   </Tooltip>
// </label>

//                       {file && (
//                         <Typography
//                           variant="body2"
//                           fontSize={12}
//                           sx={{ ml: 1 }}
//                         >
//                           {file.name}
//                         </Typography>
//                       )}
//                     </>
//                   )}

//                   <Dialog open={showDialog} onClose={handleCloseDialog}>
//                     <DialogTitle>Confirm Approval</DialogTitle>
//                     <DialogContent>
//                       {approvalMessage ? (
//                         <Typography>{approvalMessage}</Typography>
//                       ) : (
//                         <Typography>
//                          Please check the downloaded report. If you're satisfied with the fitment adoptions, click the 'Approve' button. This will automatically update your eBay listings with the new fitment information.
//                         </Typography>
//                       )}
//                     </DialogContent>
//                     <DialogActions>
//                       {!approvalMessage && (
//                         <>
//                           <Button onClick={handleCloseDialog}>Cancel</Button>
//                           <Button onClick={handleApprove} color="primary">
//                             Approve
//                           </Button>
//                         </>
//                       )}
//                       {approvalMessage && (
//                         <Button onClick={handleCloseDialog} color="primary">
//                           Close
//                         </Button>
//                       )}
//                     </DialogActions>
//                   </Dialog>
//                   <>
//                     <Snackbar
//                       open={showSnackbar}
//                       autoHideDuration={8000}
//                       onClose={() => setShowSnackbar(false)}
//                       anchorOrigin={{
//                         vertical: "bottom",
//                         horizontal: "center",
//                       }}
//                     >
//                       <Alert
//                         onClose={() => setShowSnackbar(false)}
//                         severity={
//                           uploadMessage?.includes("successfully")
//                             ? "success"
//                             : "error"
//                         }
//                         sx={{ width: "100%" }}
//                       >
//                         {uploadMessage}
//                       </Alert>
//                     </Snackbar>
//                   </>
//                 </Box>
//               ) : null;
            }
          : undefined,
    }));
  }, [headerItems]);

  return (
    <div className="mt-7 ">
      <MaterialReactTable
        columns={columns} // Pass the columns
        data={bodyItems} // Pass the data
        // enablePagination={false} // Enable pagination
        enableSorting={false} // Enable sorting
        enableColumnFilters={true} // Enable column filters if needed
        enableColumnActions={false} // Disable actions on columns
        // rowNumberMode="static" // Display static row numbers
        enableBottomToolbar={true}
        enableTopToolbar={false}
        // positionPagination='top'
        enableStickyHeader
        // enableStickyFooter
        initialState={{
          // pagination: {
          //   pageSize: 3,
          //   // pageIndex: 1  // Adjust the rows per page
          // },
          density: "compact",
        }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "500px",
            // borderRadius: "15px",
            borderRadius: "15px", // Ensure rounded corners
            overflow: "scroll",
          },
        }}
        muiTableProps={{
          sx: {
            border: "1px solid rgba(81, 81, 81, .2)",
            borderRadius: "15px", // A
            caption: {
              captionSide: "top",
            },
            overflow: "hidden",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            border: "1px solid rgba(81, 81, 81, .2)",
            // fontStyle: "italic",
            fontWeight: "bold",

            fontFamily: "poppins",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            border: "1px solid rgba(81, 81, 81, .2)",
            fontFamily: "poppins",
            fontSize: "15px",
          },
        }}
      />
    </div>
  );
};

export default DashboardTableTwo;
