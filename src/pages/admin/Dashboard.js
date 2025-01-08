import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          控制台
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            资源总数
          </Typography>
          <Typography variant="h3">42</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            总浏览量
          </Typography>
          <Typography variant="h3">1,234</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            总下载量
          </Typography>
          <Typography variant="h3">567</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 