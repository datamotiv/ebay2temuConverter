type TSize = {
	size?: string;
};

const Spinner = ({ size }: TSize) => {
	return (
		<div
			className={`inline-block ${
				size ?? "size-10"
			} animate-spin rounded-full border-4 border-solid border-gray-300 border-t-primaryColor`}
		/>
	);
};

export default Spinner;
