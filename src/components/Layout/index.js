import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout; 