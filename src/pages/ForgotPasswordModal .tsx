import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from "@mui/material";

const ForgotPasswordModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // dummy delay
      setMessage("✅ Check your email to confirm your new password.");
    } catch (error) {
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle >Reset Password</DialogTitle>
      <DialogContent className="flex flex-col gap-4 mt-4 ">
        <TextField
          label="Email Address"
          fullWidth
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
      
        />
        <TextField
          label="New Password"
          fullWidth
          size="small"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {message && <p className="text-sm mt-2">{message}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={18} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordModal;
