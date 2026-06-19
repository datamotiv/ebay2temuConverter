/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#EB232E",
				secondary: "#000000",
				green: "#008767",
				softGray: "#F1F1F1",
				borderColor: "#CFCFCF",
				lightGreen: "#16C09861",
				borderGreen: "#00B087",
			},
			fontFamily: {
				rajdhani: "'Rajdhani', poppins",
				poppins: "'Poppins', sans-serif",
			},
		},
	},
	plugins: [],
};
