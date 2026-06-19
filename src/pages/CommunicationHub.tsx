import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";
import SupportMessage from "../components/SupportMessage";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  createdTime: string;
  channel: string;
  webUrl: string;
}

// interface TicketDetails extends Ticket {
//   dueDate?: string;
//   commentCount?: string;
//   departmentId?: string;
//   assigneeId?: string;
// }

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return { bg: "#D1FAE5", text: "#333333" }; // Green
    case "Escalated":
      return { bg: "#E5E7EB", text: "#1E40AF" }; // Gray
    case "On Hold":
      return { bg: "#FEF3C7", text: "#78350F" }; // Yellow
    default:
      return { bg: "#DBEAFE", text: "#1E40AF" }; // Blue
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return { bg: "#FEE2E2", text: "#B91C1C" }; // Red
    case "Medium":
      return { bg: "#FEF3C7", text: "#4B5563" }; // Yellow
    case "Low":
      return { bg: "#D1FAE5", text: "#047857" }; // Green
    default:
      return { bg: "#E5E7EB", text: "#374151" }; // Gray
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Phone":
      return <FaPhone className="text-blue-500" />;
    case "Email":
      return <FaEnvelope className="text-green-500" />;
    case "Web":
      return <FaGlobe className="text-purple-500" />;
    default:
      return null;
  }
};

const hardcodedTicket = {
  ticketNumber: "104",
  subject: "Support Needed",
  status: "Open",
  priority: "Medium",
  createdTime: "2025-03-25T08:58:39.000Z",
  dueDate: "2025-03-26T08:58:39.000Z",
  commentCount: "0",
  description: "Test support message",
  contact: {
    firstName: "Stu",
    lastName: "Stu",
    email: "stu@arksglobal.co.uk",
    phone: "0000000000",
  },
  department: { name: "E-Motive UK Online Limited" },
  assignee: null,
  responseDueDate: null,
  threadCount: "1",
  taskCount: "0",
  webUrl:
    "https://desk.zoho.eu/support/x3ceutbj/ShowHomePage.do#Cases/dv/200397000000387001",
};

const CommunicationHub = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  // const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(null);
  const [selectedTicket] = useState(hardcodedTicket);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://api.help-on-time.com/api/datacube/tickets",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data: Ticket[] = await response.json();

      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    // debugger;
    setLoading(true);
    // setSelectedTicket(null);
    setModalOpen(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://api.help-on-time.com/api/datacube/ticket?ticketid=${ticketId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ticket details");

      // const data: TicketDetails = await response.json();

      // setSelectedTicket(data);
      // console.log(selectedTicket)
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar />
      </div>

      <div className="m-10">
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead className="bg-gray-100 font-bold">
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Created Time</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Ticket Details</TableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell>{ticket.ticketNumber}</TableCell>
                  <TableCell className="font-medium">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      sx={{
                        backgroundColor: getStatusColor(ticket.status).bg,
                        color: getStatusColor(ticket.status).text,
                        fontWeight: "bold",
                        padding: "5px 10px",
                        borderRadius: "8px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.priority}
                      sx={{
                        backgroundColor: getPriorityColor(ticket.priority).bg,
                        color: getPriorityColor(ticket.priority).text,
                        fontWeight: "bold",
                        padding: "5px 10px",
                        borderRadius: "8px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.createdTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{getChannelIcon(ticket.channel)}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => fetchTicketDetails(ticket.id)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                  </TableCell>
                  {/* <TableCell>
                    <Tooltip title="View Ticket">
                      <a
                        href={ticket.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <MdOutlineOpenInNew size={20} />
                      </a>
                    </Tooltip>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

 <div style={{ position: "sticky", zIndex: "22000" }}>
        <SupportMessage />
      </div>
      {/* Modal for Ticket Details */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ticket Details</DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : selectedTicket ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {/* Ticket Details */}
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{ fontWeight: "bold", background: "#f5f5f5" }}
                    >
                      Ticket Information
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Ticket Number</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.ticketNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Subject</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.subject}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Priority</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.priority}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Created Time</strong>
                    </TableCell>
                    <TableCell>
                      {new Date(selectedTicket.createdTime).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Due Date</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.dueDate || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Comments</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.commentCount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.description}</TableCell>
                  </TableRow>

                  {/* User & Assignment Information */}
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{ fontWeight: "bold", background: "#f5f5f5" }}
                    >
                      User & Assignment Information
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Contact Name</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.contact?.firstName}{" "}
                      {selectedTicket.contact?.lastName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Contact Email</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.contact?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Contact Phone</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.contact?.phone || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Department</strong>
                    </TableCell>
                    <TableCell>{selectedTicket.department?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Assigned To</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.assignee
                        ? selectedTicket.assignee
                        : "Not Assigned"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Response Due Date</strong>
                    </TableCell>
                    <TableCell>
                      {selectedTicket.responseDueDate || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="text-red-500">Failed to load ticket details.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunicationHub;
