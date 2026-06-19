import {
  TCategoryTableData,
  TTableHeaderData,
  TCTableProps,
} from "../utils/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

// new code
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogContentText,
  // DialogActions,
  // Button
} from "@mui/material";



interface CategoryTableProps extends TCTableProps {
  onSelectItemsChange: (selectedItems: number[]) => void;
  id: string;
  categoryId: string;
  site: string;
  fitmentFilter: number;
  setFitmentFilterOne: React.Dispatch<React.SetStateAction<number>>;
}



const CategoryTable = ({
  bodyItems,
  headerItems,
  onSelectItemsChange,
setFitmentFilterOne
 
}: CategoryTableProps) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  // new code
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [fitmentFilter, setFitmentFilter] = useState<number>(2);
  // const [openDialog, setOpenDialog] = useState(false);

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
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      const allIds = bodyItems.map((item) => item.id);
      // if (allIds.length > 5) {
      //   setOpenDialog(true); // reuse the same dialog
      //   return;
      // }
      setSelectedItems(allIds);
      setSelectAll(true);
    }
  };
  

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      // if (selectedItems.length >= 5) {
      //   setOpenDialog(true);
      //   return;
      // }
      setSelectedItems([...selectedItems, id]);
    }
  };

  // const handleSelectItem = (id: number, fitmentStatus: boolean) => {
  //   if (fitmentStatus) return; // disallow selecting fitment rows
  
  //   if (selectedItems.includes(id)) {
  //     setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  //   } else {
  //     if (selectedItems.length >= 5) {
  //       setOpenDialog(true);
  //       return;
  //     }
  //     setSelectedItems([...selectedItems, id]);
  //   }
  // };
  


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


    const handleFitmentFilterChange = (event:any) => {
      //debugger;
      const selectedFilter = event.target.value as number;
      setFitmentFilter(selectedFilter); // Update fitmentFilter in the parent (CategoryDetails)
      setFitmentFilterOne(selectedFilter)
    };
    
  

  // const filteredItems = bodyItems.filter((item) => {
  //   if (fitmentFilter === 0) return true;
  //   return fitmentFilter === 1
  //     ? item.fitmentStatus
  //     : !item.fitmentStatus;
  // });

 

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar />
      </div>

      {/* new coe */}
      <TableContainer
        component={Paper}
        style={{ maxHeight: "70vh", overflowY: "auto", width: "100%" ,minWidth: 900,}}
      >
        <Table stickyHeader size="small" style={{
      minWidth: 900, // match this with TableContainer
      // tableLayout: "fixed", // Optional: helps with layout consistency
    }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ backgroundColor: "#e0e0e0" ,}}>
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
              </TableCell>
              {/* {headerItems.map(({ id, label }: TTableHeaderData) => (
                <TableCell key={id}>{label}</TableCell>
              ))} */}
              {headerItems.map(({ id, label }: TTableHeaderData) => (
                <TableCell key={id} sx={{ backgroundColor: "#e0e0e0", color:"#333333",fontFamily: "Poppins, sans-serif"}}>
                  {label === "Fitment" ? (
                    <FormControl variant="standard" size="small" fullWidth>
                      <Select
                        value={fitmentFilter}
                        onChange={handleFitmentFilterChange}
                        displayEmpty
                      >
                        <MenuItem value={0}>All</MenuItem>
                        <MenuItem value={1}>Fitment</MenuItem>
                        <MenuItem value={2}>Non-Fitment</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerItems.length + 1} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              bodyItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(
                  ({
                    id,
                    fitmentStatus,
                    itemID,
                    listingDate,
                    title,
                    searchResultID,
                 
                  }: TCategoryTableData) => (
                    <TableRow key={id}>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedItems.includes(id)}
                          onChange={() => handleSelectItem(id)}
                          // disabled={fitmentStatus} // disables checkbox for fitment rows
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
                     
                      <TableCell align="center">
                        {fitmentStatus ? (
                          <DoneIcon style={{ color: "green" }} />
                        ) : (
                          <CloseIcon style={{ color: "red" }} />
                        )}
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

      {/* <div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Selection Limit Reached</DialogTitle>
  <DialogContent>
    <DialogContentText>
      You can only select up to 5 items. Please deselect an item before selecting a new one.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} autoFocus>
      OK
    </Button>
  </DialogActions>
</Dialog>
      </div> */}
    </>
  );
};

export default CategoryTable;
