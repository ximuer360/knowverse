import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  InputBase,
  styled,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#F1F2F3',
  '&:hover': {
    backgroundColor: '#E3E5E7',
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

const Navbar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <>
      <Box sx={{ height: '64px' }} />
      
      <AppBar 
        position="fixed"
        elevation={scrolled ? 2 : 0}
        sx={{ 
          backgroundColor: '#fff',
          color: '#333',
          transition: 'box-shadow 0.3s',
          borderBottom: scrolled ? 'none' : '1px solid #f0f0f0',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: '64px' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
              }}
            >
              KnowVerse
            </Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{ 
                  mr: 2,
                  '&:hover': {
                    color: '#00AEEC'
                  }
                }}
              >
                首页
              </Button>
              <Button
                component={Link}
                to="/categories"
                color="inherit"
                sx={{ 
                  '&:hover': {
                    color: '#00AEEC'
                  }
                }}
              >
                分类
              </Button>
            </Box>

            <Box component="form" onSubmit={handleSearch}>
              <Search>
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
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar; 