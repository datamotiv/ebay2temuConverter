import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SignUpPage from "../assets/images/SignUpPage_cleanup.png";
import CarouselOne from "../assets/images/CTwo.png";
import CarouselTwo from "../assets/images/COne.png";
import autofitpowered from "../assets/images/autofitpowered.png";


const LandingPage = () => {
  const navigate = useNavigate();
  const images = [CarouselOne,CarouselTwo];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return; // Pause transition on hover

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleHover = (state: any) => setIsPaused(state);

  const buttonPositions = [
    { bottom: "2%", left: "50%" }, // Position for Image 1
    { bottom: "1%", left: "50%" }, // Position for Image 2
  
  ];

  const imageSizes = [
    // { width: "550px", height: "550px" },
    // { width: "550px", height: "550px" },
    // { width: "500px", height: "500px" },
    { width: "450px", height: "480px" },
    { width: "450px", height: "480px" },
    {width: "450px", height: "480px" },
  ];

  const handleLoginPage = () => {
    navigate("/login");
  };

  const handleSignupPage = () => {
    navigate("/register");
  };

  return (
    <div
      style={{
        background: `url(${SignUpPage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
      className="w-full h-screen flex relative overflow-hidden z-10"
    >
       <div className="absolute bottom-4 right-1 z-30">
    <img src={autofitpowered} alt="bottomLogo" className="w-[400px] h-auto object-contain" />
  </div>
  <a href="https://emotivonline.com/" target="_blank" rel="noopener noreferrer">
  <div className="absolute top-[8%] left-[22%] transform -translate-x-1/2 bg-red-600 px-6 py-2 rounded-full shadow-lg border-2 border-[#ED1F24] z-20">
    <h2 className="text-[#ffffff] text-2xl font-bold tracking-wide font-rajdhani uppercase">
      About Emotiv
    </h2>
  </div>
</a>


      {/* Image + Button Container */}
      <div className="absolute left-0 top-10 w-[45%] h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ x: "100%", opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: "-100%", opacity: 0, filter: "blur(10px)" }}
            transition={{
              x: { duration: 0.4, ease: "easeInOut" },
              opacity: { duration: 0.3, ease: "easeInOut" },
              filter: { duration: 0.3, ease: "easeInOut" },
            }}
            className="relative flex flex-col items-center"
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            {/* Image */}
            <img
              src={images[activeIndex]}
              // className="shadow-2xl rounded-lg"
              style={{
                height: imageSizes[activeIndex].height,
                width: imageSizes[activeIndex].width,
              }}
            />

            {/* Dots Indicator */}
            {/* <div className="absolute bottom-5 flex gap-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={w-3 h-3 rounded-full transition-all ${
                    index === activeIndex ? "bg-black" : "bg-slate-500"
                  }}
                />
              ))}
            </div> */}

            {/* Buttons */}
            {/* Buttons with dynamic positioning */}
            <div
              className="absolute flex gap-4"
              style={{
                bottom: buttonPositions[activeIndex].bottom,
                left: buttonPositions[activeIndex].left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <button
                onClick={handleLoginPage}
                className="w-[120px] h-[40px] shadow-lg cursor-pointer transition-all duration-300 bg-[#ED1F24] px-6 text-white rounded-[30px] font-rajdhani text-xl font-medium text-center"
              >
                Login
              </button>

              <button
                onClick={handleSignupPage}
                className="w-[120px] h-[40px] bg-[#ED1F24] font-rajdhani text-xl font-medium cursor-pointer text-white px-6  rounded-[30px] shadow-lg hover:bg-green-600 transition-all duration-300 text-center"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;
