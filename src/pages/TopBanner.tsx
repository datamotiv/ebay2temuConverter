import { useState } from "react";
import { AlertTriangle} from "lucide-react";
import { Button } from "@mui/material";
import axios from "axios";

const TopBanner = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("https://api.help-on-time.com/api/datacube/public/ebayauth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        window.open(res.data, "_blank");
        setIsConnected(true); // ✅ Dismiss banner after opening
      }
    } catch (err) {
      console.error("Failed to fetch eBay auth URL", err);
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 text-yellow-800 py-3 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-700" />
        <span className="text-sm sm:text-base">
          You haven’t connected your eBay store yet. Click below to activate your dashboard.
        </span>
      </div>
      <Button
        // variant="outline"
        className="ml-4 text-sm px-4 py-1 bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? "Connecting..." : "🔗 Connect Now"}
      </Button>
    </div>
  );
};

export default TopBanner;
