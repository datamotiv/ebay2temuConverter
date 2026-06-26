import {
  TCategoryTableData,
  TTableHeaderData,
  TCTableProps,
} from "../utils/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
// new code
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";

interface CategoryTableProps extends TCTableProps {
  onSelectItemsChange: (selectedItems: number[]) => void;
 onOptimizeAll?: () => void;
 optimizationSelections: { [listingId: number | string]: string[] };
  setOptimizationSelections: React.Dispatch<React.SetStateAction<{ [listingId: number | string]: string[] }>>;

 extraItem?: TCategoryTableData;
}

const MigrationListingTable = ({
  bodyItems,
  headerItems,
  onSelectItemsChange,
  onOptimizeAll ,
extraItem,

}: CategoryTableProps) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  // new code
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  // const [fitmentFilter, setFitmentFilter] = useState<string>("all");
  const fitmentFilter = "all";
  const [openDialog, setOpenDialog] = useState(false);
 
  // for optimising single plans
//   const [optimizationSelections, setOptimizationSelections] = useState<{
//   [id: string]: string[];
// }>({});


// working code
  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedItems([]);
  //   } else {
  //     const allIds = bodyItems.map((item) => item.id);
  //     setSelectedItems(allIds);
  //   }
  //   setSelectAll(!selectAll);
  // };

  // trial code for event
// const handleSelectAll = () => {
//   if (selectAll) {
//     // Deselecting all items
//     setSelectedItems([]);
//     setSelectAll(false);
//   } else {
//     // Selecting all items
//     const allIds = bodyItems.map((item) => item.id);
//     setSelectedItems(allIds);
//     setSelectAll(true);
    
//     // Open dialog after selection is complete
//     if (allIds.length > 0) {
//       setOpenDialog(true);
//     }
//   }
// };
  
//  handleselctall for temu
const handleSelectAll = () => {
  if (selectAll) {
    setSelectedItems([]);
    setSelectAll(false);
  } else {
    const allIds = selectableItems.map((item) => item.id);
    setSelectedItems(allIds);
    setSelectAll(true);

    if (allIds.length > 0) {
      setOpenDialog(true);
    }
  }
};

  const handleSelectItem = (id: number, status:string) => {
    // setOpenDialog(true); // Open dialog on every selection
 if (status === "NOT_READY" || status === "PUBLISHED") return;

    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      // if (selectedItems.length >= 5) {
      //   setOpenDialog(true);
      //   return; // You may keep this to prevent adding more than 5
      // }
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  const handleRowDoubleClick = (id: number) => {
    navigate(`/ebay-search-report/${id}`);
  };

  useEffect(() => {
    onSelectItemsChange(selectedItems);
  }, [selectedItems, onSelectItemsChange]);

  // new code
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredItems = bodyItems.filter((item) => {
    if (fitmentFilter === "all") return true;
    return fitmentFilter === "fitment"
      ? item.fitmentStatus
      : !item.fitmentStatus;
  });
  const finalItems = extraItem
  ? [extraItem, ...filteredItems.filter(item => item.id !== extraItem.id)]
  : filteredItems;
  // code for selection of optimisation
//   const handleOptimizationChange = (id: any, option: string) => {
//   setOptimizationSelections((prev) => {
//     const currentOptions = prev[id] || [];
//     const alreadySelected = currentOptions.includes(option);

//     const updated = alreadySelected
//       ? currentOptions.filter((opt) => opt !== option)
//       : [...currentOptions, option];

//     return {
//       ...prev,
//       [id]: updated,
//     };
//   });
// };

const selectableItems = finalItems.filter(
  (item) => item.status !== "NOT_READY" && item.status !== "PUBLISHED"
);




const isRowDisabled = (status: string) =>
  status === "NOT_READY" || status === "PUBLISHED";

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar />
      </div>

      {/* new coe */}
      <TableContainer
        component={Paper}
        style={{ maxHeight: "70vh", overflowY: "auto", width: "100%" }}
      >
        <Table stickyHeader size="small" style={{ minWidth: "100%" }}>
          <TableHead>
            <TableRow  
  // key={id}
  sx={{
    opacity: isRowDisabled(status) ? 0.5 : 1,
    pointerEvents: isRowDisabled(status) ? "none" : "auto",
  }}
  >
              <TableCell align="center" sx={{ backgroundColor: "#FAFAFA"}}>
                <Checkbox 
 disabled={selectableItems.length === 0}
                  checked={selectAll} 
                  onChange={handleSelectAll} />
              </TableCell>
              {/* {headerItems.map(({ id, label }: TTableHeaderData) => (
                <TableCell key={id}>{label}</TableCell>
              ))} */}
              {headerItems.map(({ id, label }: TTableHeaderData) => (
                <TableCell align="center" key={id} sx={{ backgroundColor: "#FAFAFA", color:"#333333",fontFamily: "Poppins, sans-serif"}}>
                  {label }
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerItems.length + 1} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              [...finalItems]
              .sort((a,b)=> Number(a.optimizationPercent) -Number(b.optimizationPercent))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
               .map(({ id, itemID, listingDate, title, searchResultID, optimizationPercent,status }: TCategoryTableData) => {




  return (
    <TableRow key={id}>
      <TableCell align="center">
        <Checkbox
         disabled={isRowDisabled(status)}
          checked={selectedItems.includes(id)}
          onChange={() => handleSelectItem(id, status)}
        />
      </TableCell>

      <TableCell>{itemID}</TableCell>
      <TableCell>{listingDate}</TableCell>

      <TableCell
        onClick={() => handleRowDoubleClick(searchResultID)}
        style={{
          color: "#2563EB",
          cursor: "pointer",
        }}
      >
        {title}
      </TableCell>

      {/* ✅ USE IT HERE */}
      <TableCell align="center">
      {optimizationPercent}
      </TableCell>

      <TableCell align="center" style={{ fontWeight: "bold" }}>
        {100 - Number(optimizationPercent)}
      </TableCell>

      {/* readyness status*/}
   <TableCell align="center">
  <span
    style={{
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "bold",

      color:
        !status
          ? "#666"
          : status === "READY"
          ? "green"
          : status === "READY_WITH_WARNINGS"
          ? "#b58900"
          : status === "PUBLISHED"
          ? "#0000ff"
          : "red",

      background:
        !status
          ? "#F3F4F6"
          : status === "READY"
          ? "#E6F9F0"
          : status === "READY_WITH_WARNINGS"
          ? "#FFF4E5"
          : status === "PUBLISHED"
          ? "#E8EDFF"
          : "#FDECEA",
    }}
  >
    {status || "Validating..."}
  </span>
</TableCell>
    </TableRow>
  );
})
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25]}
        component="div"
        count={bodyItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <div>
      <Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
      textAlign: 'center',
    },
  }}
>
 <DialogTitle>
  <Typography variant="h6" fontWeight="bold" color="error">
 Select all eligible listings for migration?
  </Typography>
</DialogTitle>



<DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
  <Button
    onClick={() => setOpenDialog(false)}
    variant="contained"
  
    sx={{ px: 4, borderRadius: 2, color: 'black', backgroundColor: '#fff' }}
  >
    Cancel
  </Button>
  <Button
    onClick={onOptimizeAll}
    variant="contained"
    sx={{ px: 4, borderRadius: 2, backgroundColor: '#EB232E' }}
  >
  Select All
  </Button>
</DialogActions>


</Dialog>
      </div>
    </>
  );
};

export default MigrationListingTable;
