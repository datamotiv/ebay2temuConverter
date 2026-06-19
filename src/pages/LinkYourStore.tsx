import { Card, Box,Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ebayLogo from "../assets/images/ebay-logo.png";
import shopifyLogo from "../assets/images/Shopify-Logo.png";
import temuLogo from "../assets/images/temu-logo.png";
import allegroLogo from "../assets/images/allegro-logo.png";
import Navbar from "../components/Navbar";
import { connectTemu } from "../services/temuService";
import { useSelector } from "react-redux";
import {
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import { useState } from "react";

const stores = [
  {
    name: "eBay",
    key: "ebay",
    logo: ebayLogo,
    bg: "#F0F7FF",
    url: "https://auth.ebay.com/oauth2/authorize?state=GUID:8258dd0a-e29a-49a4-92dc-35308e7a8df2&client_id=AndrewRo-Emotived-PRD-3786bc793-b1c0583d&response_type=code&redirect_uri=Andrew_Rowson-AndrewRo-Emotiv-hnvajdx&scope=https://api.ebay.com/oauth/api_scope/sell.marketing.readonly%20https://api.ebay.com/oauth/api_scope/sell.marketing%20https://api.ebay.com/oauth/api_scope/sell.inventory.readonly%20https://api.ebay.com/oauth/api_scope/sell.inventory%20https://api.ebay.com/oauth/api_scope/sell.account.readonly%20https://api.ebay.com/oauth/api_scope/sell.account%20https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly%20https://api.ebay.com/oauth/api_scope/sell.fulfillment%20https://api.ebay.com/oauth/api_scope/sell.analytics.readonly%20https://api.ebay.com/oauth/api_scope/sell.finances%20https://api.ebay.com/oauth/api_scope/sell.payment.dispute%20https://api.ebay.com/oauth/api_scope/commerce.identity.readonly&prompt=login",
  },
  {
    name: "Temu",
    key: "temu",
    logo: temuLogo,
    bg: "#FFF4E5",
    url: "https://www.temu.com/login.html",
  },
  {
    name: "Shopify",
    key: "shopify",
    logo: shopifyLogo,
    bg: "#E6FFF2",
    url: "https://accounts.shopify.com/store-login",
  },
  
  {
    name: "Allegro",
    key: "allegro",
    logo: allegroLogo,
    bg: "#FFF2F0",
    url: "https://allegro.com/log-in",
  },
];




export default function LinkYourStore() {

  const [loading, setLoading] = useState(false);

const [message, setMessage] = useState("");

const [messageType, setMessageType] = useState<
  "success" | "error"
>("success");

const [openSnackbar, setOpenSnackbar] =
  useState(false);
 
const sellerId = useSelector((state: any) => state.auth.sellerId);
console.log(sellerId);

// working temu connect
// const handleTemuClick = async () => {
//   debugger;
  
//   try {
//     const res: any = await connectTemu(sellerId);

//     if (!res?.authUrl) {
//       console.error("authUrl not found", res);
//       return;
//     }
// console.log(res, 'check auth link');
//     // redirect to Temu
//     window.location.href = res.authUrl;

//   } catch (error) {
//     console.error(error);
//   }
// };

const handleTemuClick = async () => {
  debugger;
  try {
    setLoading(true);

    const res: any = await connectTemu(
      sellerId
    );

    console.log(res, "check auth link");

    // =====================================
    // SUCCESS
    // =====================================

    if (res?.authUrl) {
      setMessage(
        "Redirecting to Temu authorization..."
      );

      setMessageType("success");

      setOpenSnackbar(true);

      // redirect after short delay
      setTimeout(() => {
        window.location.href = res.authUrl;
      }, 1000);

      return;
    }

    // =====================================
    // ERROR MESSAGE FROM API
    // =====================================

    if (res?.message) {
      setMessage(res.message);

      setMessageType("error");

      setOpenSnackbar(true);

      return;
    }

    // fallback
    setMessage("Something went wrong");

    setMessageType("error");

    setOpenSnackbar(true);
  } catch (error: any) {
    console.error(error);

    // =====================================
    // AXIOS ERROR RESPONSE
    // =====================================

    const apiMessage =
      error?.response?.data?.message ||
      "Failed to connect Temu account";

    setMessage(apiMessage);

    setMessageType("error");

    setOpenSnackbar(true);
  } finally {
    setLoading(false);
  }
};
 
  return (
<>
<div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6 ">
        <Navbar />
      </div>

  <Box sx={{ p: 4 }}>
  <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
    Link Your Store
  </Typography>
  <Typography variant="body1" align="center" color="text.secondary" mb={4}>
   Get started by clicking on a store to optimize listings and manage fitment.
  </Typography>

  <Grid container spacing={4} justifyContent="center">
   {stores.map(({ name, key, logo, bg, url }) => (
  <Grid key={key} size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
    
    {key === "temu" ? (
      // 🔥 Temu → API call
      <Card
        onClick={handleTemuClick}
        sx={{
          backgroundColor: bg,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "2",
          cursor: "pointer",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
      >
        <Box
          component="img"
          src={logo}
          alt={name}
          sx={{
            width: "60%",
            height: "60%",
            objectFit: "contain",
          }}
        />
      </Card>
    ) : (
      // ✅ Other platforms → normal link
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Card
          sx={{
            backgroundColor: bg,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "2",
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 6,
            },
          }}
        >
          <Box
            component="img"
            src={logo}
            alt={name}
            sx={{
              width: "60%",
              height: "60%",
              objectFit: "contain",
            }}
          />
        </Card>
      </a>
    )}

  </Grid>
))}
  </Grid>
</Box>


<div>
  {/* ===================================== */}
{/* LOADER */}
{/* ===================================== */}

<Backdrop
  open={loading}
  sx={{
    color: "#fff",
    zIndex: 9999,
  }}
>
  <CircularProgress color="inherit" />
</Backdrop>

{/* ===================================== */}
{/* MESSAGE POPUP */}
{/* ===================================== */}

<Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
>
  <Alert
    severity={messageType}
    variant="filled"
    onClose={() =>
      setOpenSnackbar(false)
    }
  >
    {message}
  </Alert>
</Snackbar>
</div>
</>

  );
}
