import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            总资源数
          </Typography>
          <Typography component="p" variant="h4">
            0
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            分类数量
          </Typography>
          <Typography component="p" variant="h4">
            0
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            总下载量
          </Typography>
          <Typography component="p" variant="h4">
            0
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 