type ProgressBarProps = {
	percentage: number;
};

const TableProgressBar = ({ percentage }: ProgressBarProps) => {
	return (
		<div className="w-full bg-[#F0F0F0] rounded-[4px] h-6 relative">
			<div
				className="absolute top-0 left-0 bg-[#0EB61A99] h-full rounded-[4px]"
				style={{ width: `${percentage}%` }}
			/>
			<span className="absolute top-[2px] right-4 text-sm font-medium text-secondary">
				{percentage}%
			</span>
		</div>
	);
};

export default TableProgressBar;
