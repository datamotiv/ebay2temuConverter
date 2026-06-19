import Navbar from "../components/Navbar";
// import priceBanner from "../assets/images/priceBanner.png"
import pricingStructure from "../assets/images/pstructure.png";

const CoverPage = () => {
  return (
    <>
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6 ">
    <Navbar  />
  </div>  
 
  <div className="relative bg-[#000000] mt-0 p-0 m-0 min-h-screen">
  <img src={pricingStructure} alt="" className="w-full block" />
  
  {/* <div className="absolute mt-4 bottom-[40%] right-[15%] max-w-[600px]  bg-white text-[#ec2227] text-left font-bold text-xl leading-snug rounded-xl p-4 shadow-lg">
  <Tooltip title="Contact us for more information">
    <p>
      To unlock the full power of<br />
       AutoFit Pro Please Contact<br />
       <a
    href="https://emotivonline.com/contact/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      cursor:'pointer',
      marginRight:'5px'
    }}
  >
Emotiv
    <CallMadeIcon style={{ fontSize: "1rem" }} />
  </a>
       
       for complete Price<br />
      
    </p>
    </Tooltip>
  </div> */}
</div>


    </>
  );
};

export default CoverPage;