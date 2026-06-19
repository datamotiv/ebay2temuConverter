import { Button, Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 5,
          borderRadius: 4,
          boxShadow: 3,
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {/* Error Icon */}
        <ErrorOutlineIcon
          sx={{
            fontSize: 80,
            color: "#d32f2f",
            mb: 2,
          }}
        />

        {/* Heading */}
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
        >
          Something Went Wrong
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
        >
          We were unable to complete your request.
          Please try again later or reconnect your
          marketplace account.
        </Typography>

        {/* Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;