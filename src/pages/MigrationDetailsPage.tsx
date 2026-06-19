import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router";

const MigrationDetailsPage = () => {
  const { migrationId: paramId } = useParams();
const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
const migrationId =
  paramId ||
  location.state?.migrationId;

  console.log(paramId, 'tetist')

  const fetchItems = async () => {
    const token = localStorage.getItem("accessToken");

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/migrations/${migrationId}/items?page=1&limit=25`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log(data, 'job tatas tdat')
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!migrationId) return;

  fetchItems();
}, [migrationId]);

// api call for retry
const retryMigration = async (migrationId: string) => {
  const token = localStorage.getItem("accessToken");
debugger;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/migrations/${migrationId}/retry`,
      {
        method: "POST", // ⚠️ confirm with backend (POST or PATCH)
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Retry failed");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Retry error:", error);
    throw error;
  }
};


const handleRetry = async (migrationId: string) => {
  try {
    await retryMigration(migrationId);

    // optional UX
    alert("Retry started successfully");

    // refresh table
    fetchItems(); // your existing API call

  } catch (error) {
    console.error(error);
    alert("Retry failed");
  }
};


//   const getStatusColor = (status: string) => {
//   switch (status) {
//     case "DONE":
//       return "green";
//     case "FAILED":
//       return "red";
//     case "PROCESSING":
//       return "blue";
//     case "PENDING_REVIEW":
//       return "orange";
//     case "ACTIVE":
//       return "purple";
//     case "REJECTED":
//       return "black";
//     default:
//       return "gray";
//   }
// };

  const filteredItems =
    statusFilter === "ALL"
      ? items
      : items.filter((item) => item.status === statusFilter);

  return (
    <>
     <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar />
      </div>
<div className="p-6 bg-gray-50 min-h-screen">

  {/* 🔝 Header */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Migration Job Details
      </h2>
      <p className="text-sm text-gray-500">
        Track the progress and status of your migrated listings
      </p>
    </div>

    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
    >
      ← Back
    </button>
  </div>

  {/* 🔍 Filters */}
  <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center gap-4">
    <label className="text-sm font-medium text-gray-600">
      Filter by status:
    </label>

    <select
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="ALL">All</option>
      <option value="FAILED">Failed Only</option>
      <option value="DONE">Done</option>
      <option value="PROCESSING">Processing</option>
      <option value="PENDING_REVIEW">Pending Review</option>
    </select>
  </div>

  {/* 📊 Table Card */}
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">

    {loading ? (
      <div className="p-6 text-center text-gray-500">
        Loading migration data...
      </div>
    ) : filteredItems.length === 0 ? (
      <div className="p-6 text-center text-gray-400">
        No items found
      </div>
    ) : (
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Listing ID</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Details</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {item.sourceListingId}
              </td>

              {/* ✅ Status Badge */}
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "DONE"
                      ? "bg-green-100 text-green-700"
                      : item.status === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : item.status === "PROCESSING"
                      ? "bg-blue-100 text-blue-700"
                      : item.status === "PENDING_REVIEW"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

         <td className="px-4 py-3 text-gray-600">
  {item.status === "FAILED" ? (
    <div className="flex items-center justify-between gap-2">
      
      {/* ❗ Error Message */}
      <span className="text-red-500 text-xs">
        {item.errors?.[0]?.message || "Migration failed"}
      </span>

      {/* 🔁 Retry Button */}
      <button
        onClick={() => handleRetry(item.migrationId)}
        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
      >
        Retry
      </button>

    </div>
  ) : item.errors?.[0]?.message ? (
    <span className="text-yellow-600 text-xs">
      {item.errors[0].message}
    </span>
  ) : (
    "-"
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>
     </>
  );
};

export default MigrationDetailsPage;