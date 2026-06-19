import { useState } from "react";
import {useSupportMutation} from "../Redux/features/summary/summaryApi";
import ChatIcon from '@mui/icons-material/Chat';
import { Tooltip } from "@mui/material";

import toast from "react-hot-toast";

const SupportMessage = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [supportRequest] = useSupportMutation();

	const handleSendMessage = async () => {
		const data = {
			message,
		};
		try {
			const response = await supportRequest(data).unwrap();
			if (response) {
				toast.success(response.message);
			}
		} catch (error: any) {
			console.error("Error details:", error);
			if (error.data?.message) {
				toast.error(`${error.data.message}`);
			} else {
				toast.error("An error occurred while requesting support.");
			}
		}
		setMessage("");
		setIsOpen(false); // Close the message box after sending
	};

	const handleClose = () => {
			setIsOpen(false); // Close the message box without sending
			setMessage(""); // Clear the input
	};

	return (
		<div className="fixed bottom-10 right-8">
			{!isOpen ? (
				// Small button with left-facing arrow
				<button
					onClick={() => setIsOpen(true)}
					className="p-2 bg-blue-500 text-white rounded-full flex justify-center items-center"
				>
          {/* <span style={{ fontSize: "10px", transform: "rotate(180deg)" }}>
            ➤
          </span> */}
		  <Tooltip title="Need help or have questions? Click here to contact support"> 
  <span
    style={{
      fontSize: '10px',
      transform: 'rotate(180deg)',
      cursor: 'pointer',
      display: 'inline-block',
	  zIndex:'2000'
    }}
  >
    <ChatIcon />
  </span> 
</Tooltip>
				</button>
			) : (
				// Expanded message box
				<div className="bg-white shadow-lg p-4 rounded-lg border w-64">
					<div className="flex justify-between items-center mb-2">
						<p className="text-sm font-medium text-gray-700">Support Message</p>
						{/* Close button */}
						<button
							onClick={handleClose}
							className="text-gray-500 hover:text-gray-700 text-sm"
						>
							✖
						</button>
					</div>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Write your message..."
						className="w-full h-20 p-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					<div className="mt-2 flex justify-end">
						<button
							onClick={handleSendMessage}
							className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
						>
							Send
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SupportMessage;
