import { useEffect, useState } from "react";
import {  useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const MigrationJobDetails = () => {
  const navigate = useNavigate();
const [page, setPage] = useState(1);
const [limit] = useState(10);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [meta, setMeta] = useState<any>({});


// get all migratins
const getAllMigrations = async (
  page = 1,
  limit = 10,
  status = "ALL"
) => {
  const token = localStorage.getItem("accessToken");

  try {
    // ✅ build query params dynamically
    let url = `${import.meta.env.VITE_LOCAL_TEMU_BASE_URL}/api/v1/migrations?page=${page}&limit=${limit}`;

    if (status !== "ALL") {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch migrations");
    }

    const data = await response.json();

    return data; // return full response (items + meta)
  } catch (error) {
    console.error(error);
    throw error;
  }
};

useEffect(() => {
  const fetchJobs = async () => {
    const res = await getAllMigrations(page, limit, statusFilter);

    setJobs(res.items || []);
    setMeta(res.meta || {});
  };

  fetchJobs();
}, [page, statusFilter]);

//optional for better performance
useEffect(() => {
  if (statusFilter === "PROCESSING") {
    const interval = setInterval(() => {
      getAllMigrations(page, limit, statusFilter).then((res) => {
        setJobs(res.items);
      });
    }, 3000);

    return () => clearInterval(interval);
  }
}, [statusFilter, page]);




  // ✅ Filter logic
  const filteredJobs =
    statusFilter === "ALL"
      ? jobs
      : jobs.filter((job) => job.status === statusFilter);

  // ✅ Status color
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "QUEUED":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 🔝 Header */}
         <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
              <Navbar />
            </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Migration Jobs
          </h2>
          <p className="text-sm text-gray-500">
            View and track all migration jobs
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      {/* 🔍 Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">
          Filter by status:
        </span>

        <select
          value={statusFilter}
         onChange={(e) => {
    setStatusFilter(e.target.value);
    setPage(1); // ✅ reset page when filter changes
  }}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="ALL">All</option>
          <option value="QUEUED">Queued</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* 📊 Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No jobs found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Migration ID</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Progress</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3 text-left">Failed</th>
                <th className="px-4 py-3 text-left">Pending</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.migrationId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {job.migrationId}
                  </td>

                  {/* ✅ Status Badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>

                  {/* ✅ Progress Bar */}
                  <td className="px-4 py-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${job.progressPercentage}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {job.progressPercentage}%
                    </span>
                  </td>

                  <td className="px-4 py-3">{job.total}</td>
                  <td className="px-4 py-3 text-green-600">
                    {job.publishedCount}
                  </td>
                  <td className="px-4 py-3 text-red-600">
                    {job.failedCount}
                  </td>
                  <td className="px-4 py-3 text-yellow-600">
                    {job.pendingCount}
                  </td>

                  {/* ✅ Action */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        navigate(`/migration-details/${job.migrationId}`)
                      }
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Details →
                    </button>

                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center mt-4">
  <button
    disabled={!meta.hasPrev}
    onClick={() => setPage((prev) => prev - 1)}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-sm text-gray-600">
    Page {meta.page} of {meta.pages}
  </span>

  <button
    disabled={!meta.hasNext}
    onClick={() => setPage((prev) => prev + 1)}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
      </div>
    </div>
  );
};

export default MigrationJobDetails;