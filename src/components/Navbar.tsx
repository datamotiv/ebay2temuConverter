import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import Modal from 'react-modal';
import CloseIcon from '../assets/icons/CloseIcon';
// import emotivLogo from "../assets/images/emotivLogo.png"
// import autofitProLogo from "../assets/images/autofitProLogo.png"
import { useNavigate } from 'react-router-dom';
import allegroLogo from '../assets/images/allegro-logo.png';
import e2tLogo from '/logo.png';
import ebayLogo from '../assets/images/ebay-logo.png';
import shopifyLogo from '../assets/images/Shopify-Logo.png';
import temuLogo from '../assets/images/temu-logo.png';
// new code for swithc button
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Button, ListItemText, Menu, MenuItem } from '@mui/material';

// type TNavbarProps = {
// 	title: string;
// };

const customStyles = {
  overlay: {
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Optional, dark background behind modal
  },
  content: {
    zIndex: 1001,
    borderRadius: '10px',
    // padding: '20px',
    // height: '45rem',
    maxWidth: '75rem',
    margin: 'auto',
    overflow: 'hidden',
  },
};

const Navbar = () => {
  const userName = localStorage.getItem('userName');
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [storeAnchorEl, setStoreAnchorEl] = useState(null);
  const openStoreMenu = Boolean(storeAnchorEl);

  function closeModal() {
    setIsOpen(false);
  }

  const handleAvatarClick = () => {
    navigate('/profile'); // or your actual profile edit route
  };

  // code for switch store
  const handleStoreButtonClick = (event: any) => {
    setStoreAnchorEl(event.currentTarget);
  };

  const handleStoreSelect = (store: any) => {
    setStoreAnchorEl(null);

    switch (store) {
      case 'shopify':
        navigate('/dashboard-shopify');
        break;
      case 'ebay':
        navigate('/Dashboard'); // or any other route
        break;
      case 'temu':
        navigate('/dashboard-temu'); // or any other route
        break;
      case 'allegro':
        navigate('/dashboard-allegro'); // or any other route
        break;
      default:
    }
  };

  return (
    <div className="flex  justify-evenly border-b-2 items-center py-4 px-4">
      {/* Left section: Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <img src={e2tLogo} height={40} className="h-10 w-auto object-contain" alt="E2T Logo" />
        {/* <span className="ml-0 mb-2 bg-[#F4D06F] text-black text-[14px] font-bold px-3 py-1 rounded-full">
    BETA
  </span> */}
      </div>

      {/* add swicth store button here */}
      <div className="absolute right-3/4 transform -translate-x-1/7 flex items-end">
        <Button
          onClick={handleStoreButtonClick}
          endIcon={<ArrowDropDownIcon />}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '15px',
            fontFamily: 'Poppins',
            fontWeight: 500,
            fontSize: '14px',
            bgcolor: '#fff',
            color: '#0F0C22',
            '&:hover': {
              bgcolor: '#ED1F24',
              color: 'white',
            },
          }}
        >
          Switch Store
        </Button>

        <Menu
          anchorEl={storeAnchorEl}
          open={openStoreMenu}
          onClose={() => setStoreAnchorEl(null)}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              borderRadius: '10px',
              minWidth: 200,
              fontFamily: 'Poppins',
            },
          }}
        >
          {[
            { name: 'eBay', logo: ebayLogo, key: 'ebay' },
            { name: 'Shopify', logo: shopifyLogo, key: 'shopify' },
            { name: 'Temu', logo: temuLogo, key: 'temu' },
            { name: 'Allegro', logo: allegroLogo, key: 'allegro' },
          ].map(({ name, logo, key }) => (
            <MenuItem key={key} onClick={() => handleStoreSelect(key)}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  component="img"
                  src={logo}
                  alt=""
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain',
                  }}
                />
                <ListItemText primary={`Switch to ${name}`} />
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </div>

      {/* Right section: Profile and Notifications */}
      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={handleAvatarClick}
          className="flex items-center gap-2.5 text-secondary px-4"
        >
          <span className="text-sm font-poppins font-medium">{userName}</span>
          <span>
            <Avatar alt="User Avatar" className="cursor-pointer" />
          </span>
          {/* <AngleDown />  */}
        </button>

        {/* <div className="flex items-center">
        <NotificationsNoneIcon style={{ color: 'grey' }} />
      </div> */}
      </div>

      {/* Modal */}
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="flex flex-col items-end h-full">
            <button onClick={closeModal} className="text-red-500">
              <CloseIcon />
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
