import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { IconButton, Tooltip } from '@mui/material';

const HomeButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard'); // Change path if your dashboard route is different
  };

  return (
    <Tooltip title="Go to Dashboard">
      <IconButton color="secondary" onClick={handleClick}>
        <DashboardIcon />
      </IconButton>
    </Tooltip>
  );
};

export default HomeButton;
