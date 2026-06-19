import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import CelebrationIcon from "@mui/icons-material/Celebration";
import LaunchIcon from '@mui/icons-material/Launch';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  onLinkEbay: () => void;
}

const WelcomeUser: React.FC<WelcomeDialogProps> = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);

  const handleSellerInfo = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://api.help-on-time.com/api/datacube/public/ebayauth",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const ebayOAuthUrl = response.data;
        // window.location.href = ebayOAuthUrl; // redirect immediately
        window.open(ebayOAuthUrl, "_blank"); // Open in new tab
      }
    } catch (error) {
      console.error("Error fetching eBay auth URL:", error);
    }
  };

  return (
    <>
      {showWelcomeDialog && (
        <Dialog
          open
          onClose={() => setShowWelcomeDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              padding: 3,
              backgroundColor: "#f9fafb",
              boxShadow: 10,
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}
          >
            <CelebrationIcon style={{ color: "red" }} /> Welcome to AutoFit Pro!
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center", mt: 1 }}>
            <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>
              We’re excited to have you on board! 
            </p>
            <p style={{ fontSize: "1rem", color: "#555" }}>
              To get started, you’ll need to link your account so we can
              fetch your listings and assist with fitment adoption.
            </p>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSellerInfo}
              sx={{
                backgroundColor: "#FF0000",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#CC0000",
                },
              }}
            >
       Link your store     <span></span>  <LaunchIcon style={{color:'white'}} />
            </Button>
            {/* Optionally: Add a 'Learn More' button */}
            {/* <Button onClick={() => setShowWelcomeDialog(false)}>Skip for now</Button> */}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default WelcomeUser;
