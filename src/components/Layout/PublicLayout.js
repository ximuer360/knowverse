import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  InputBase,
  alpha,
  styled,
} from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const PublicLayout = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              flexGrow: 0,
              display: 'flex',
              alignItems: 'center',
              mr: 4
            }}
          >
            KnowVerse
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button color="inherit" component={Link} to="/">首页</Button>
            <Button color="inherit" component={Link} to="/categories">分类</Button>
            <Button color="inherit" component={Link} to="/resources">资源</Button>
          </Box>

          <Search component="form" onSubmit={handleSearch}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="搜索资源..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>

      <Container sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} KnowVerse. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout; 