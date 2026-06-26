import {
  TCategoryTableData,
  TTableHeaderData,
  TCTableProps,
} from "../utils/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
// new code
import {
  Typography,
  Box,
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
  DialogContent,
  DialogActions,
  Button,
  FormControl,MenuItem, Select,ListItemText
} from "@mui/material";

interface CategoryTableProps extends TCTableProps {
  onSelectItemsChange: (selectedItems: number[]) => void;
 onOptimizeAll?: () => void;
 optimizationSelections: { [listingId: number | string]: string[] };
  setOptimizationSelections: React.Dispatch<React.SetStateAction<{ [listingId: number | string]: string[] }>>;
}

const ListingCategoryTable = ({
  bodyItems,
  headerItems,
  onSelectItemsChange,
  onOptimizeAll ,
  optimizationSelections,
setOptimizationSelections
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
const handleSelectAll = () => {
  if (selectAll) {
    // Deselecting all items
    setSelectedItems([]);
    setSelectAll(false);
  } else {
    // Selecting all items
    const allIds = bodyItems.map((item) => item.id);
    setSelectedItems(allIds);
    setSelectAll(true);
    
    // Open dialog after selection is complete
    if (allIds.length > 0) {
      setOpenDialog(true);
    }
  }
};
  

  const handleSelectItem = (id: number) => {
    // setOpenDialog(true); // Open dialog on every selection
  
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


const handleOptimizationChange = (listingId:number | string, option:string) => {
  const key = String(listingId);
  setOptimizationSelections((prev) => {
    const existing = prev[key] || [];
    const updated = existing.includes(option)
      ? existing.filter((item) => item !== option)
      : [...existing, option];
    return { ...prev, [key]: updated };
  });
};

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
            <TableRow>
              <TableCell align="center" sx={{ backgroundColor: "#FAFAFA"}}>
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
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
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerItems.length + 1} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              [...filteredItems]
              .sort((a,b)=> Number(a.optimizationPercent) -Number(b.optimizationPercent))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(
                  ({
                    id,
                    itemID,
                    listingDate,
                    title,
                    searchResultID,
                    optimizationPercent,
                  }: TCategoryTableData) => (
                    <TableRow key={id}>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedItems.includes(id)}
                          onChange={() => handleSelectItem(id)}
                        />
                      </TableCell>
                      <TableCell>{itemID}</TableCell>
                      <TableCell>{listingDate}</TableCell>
                      <TableCell
                        onClick={() => handleRowDoubleClick(searchResultID)}
                        style={{
                          color:  "#2563EB",
                          cursor: "pointer",
                   
                        }}
                      >
                        {title}
                      </TableCell>
                      <TableCell align="center">{optimizationPercent}</TableCell>
                      <TableCell align="center"  style={{fontWeight:'bold'}}>{100 - Number(optimizationPercent)}</TableCell>
  
{/* new code for selecting optimiztion */}
<TableCell align="center">
  <FormControl size="small">
    <Select
      multiple
      displayEmpty
      value={optimizationSelections[id] || []}
      onChange={() => {}}
      renderValue={() => "Optimize"}
      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
    >
      {["Title", "Item Specifics"].map(
        (option) => (
          <MenuItem
            key={option}
            value={option}
            onClick={() => handleOptimizationChange(id, option)}
          >
            <Checkbox
              checked={(optimizationSelections[id] || []).includes(option)}
            />
            <ListItemText primary={option} />
          </MenuItem>
        )
      )}
    </Select>
  </FormControl>
</TableCell>

                    </TableRow>
                  )
                )
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
    Apply Optimization to All Selected Listings
  </Typography>
</DialogTitle>

<DialogContent>
  <Typography variant="body1" sx={{ mt: 1 }}>
    This will apply the following optimizations to all listings:
  </Typography>

  <Box component="ul" sx={{ mt: 1, pl: 2 }}>
    <Typography component="li" variant="body2" color="text.secondary">
      Smart title updates to improve visibility
    </Typography>
    <Typography component="li" variant="body2" color="text.secondary">
    Enhanced descriptions for better engagement
    </Typography>
    <Typography component="li" variant="body2" color="text.secondary">
      Improved item specifics for accurate search results
    </Typography>
  </Box>

</DialogContent>

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
    Optimize All Items
  </Button>
</DialogActions>


</Dialog>
      </div>
    </>
  );
};

export default ListingCategoryTable;
