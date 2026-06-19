import ArrowLeftIcon from "../assets/icons/ArrowLeftIcon";
import ArrowRightIcon from "../assets/icons/ArrowRightIcon";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}
const Pagination = ({
	totalPages,
	currentPage,
	onPageChange,
}: PaginationProps) => {
	const handlePrev = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};
	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	const handlePageClick = (page: number) => {
		onPageChange(page);
	};

	const renderPageNumbers = () => {
		const pages = [];

		let startPage = Math.max(1, currentPage - 2);
		let endPage = Math.min(totalPages, currentPage + 2);

		if (currentPage <= 3) {
			endPage = Math.min(totalPages, 5);
		} else if (currentPage >= totalPages - 2) {
			startPage = Math.max(1, totalPages - 4);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<button
					key={i}
					className={`border py-2 px-3 ${
						currentPage === i ? "bg-gray-300" : ""
					}`}
					onClick={() => handlePageClick(i)}
				>
					{i}
				</button>
			);
		}

		return pages;
	};

	return (
		<div className="flex justify-center space-x-2">
			<button
				className="border py-1 px-4"
				onClick={handlePrev}
				disabled={currentPage === 1}
			>
				<ArrowLeftIcon />
			</button>
			{renderPageNumbers()}
			<button
				className="border py-1 px-4"
				onClick={handleNext}
				disabled={currentPage === totalPages}
			>
				<ArrowRightIcon />
			</button>
		</div>
	);
};

export default Pagination;
