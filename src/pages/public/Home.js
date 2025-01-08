import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getResources } from '../../services/api';

const Home = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await getResources();
        console.log('API Response:', response);
        setResources(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError(error.message);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getImageUrl = (resource) => {
    if (!resource.thumbnail && !resource.cover_image) {
      return 'https://via.placeholder.com/357x214';
    }
    return `http://localhost:5001/${resource.thumbnail || resource.cover_image}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  if (loading) return <Typography>加载中...</Typography>;
  if (error) return <Typography color="error">错误: {error}</Typography>;
  if (!Array.isArray(resources) || resources.length === 0) {
    return <Typography>暂无资源</Typography>;
  }

  return (
    <Box sx={{ 
      backgroundColor: '#F1F2F3',
      minHeight: '100vh',
      py: 3,
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 16px',
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontSize: '20px',
            fontWeight: 500,
            mb: 3,
            color: '#18191C'
          }}
        >
          最新资源
        </Typography>
        
        <Grid container spacing={2}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={3} key={resource.id}>
              <Card 
                sx={{ 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  boxShadow: 'none',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardActionArea 
                  component={Link} 
                  to={`/resources/${resource.id}`}
                  sx={{ height: '100%' }}
                >
                  <Box sx={{ 
                    position: 'relative',
                    paddingTop: '62.5%',
                    backgroundColor: '#F5F5F5',
                    overflow: 'hidden'
                  }}>
                    <CardMedia
                      component="img"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      image={getImageUrl(resource)}
                      alt={resource.title}
                    />
                  </Box>
                  <CardContent sx={{ p: '12px' }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#18191C',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                        height: '42px',
                        mb: 1.5,
                      }}
                    >
                      {resource.title}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: '#9499A0',
                        fontSize: '12px',
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                      }}>
                        <CategoryIcon sx={{ fontSize: '14px' }} />
                        <Typography sx={{ fontSize: 'inherit' }}>
                          {resource.category_name}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 0.5,
                      }}>
                        <AccessTimeIcon sx={{ fontSize: '14px' }} />
                        <Typography sx={{ fontSize: 'inherit' }}>
                          {formatDate(resource.created_at)}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 0.5,
                      }}>
                        <VisibilityIcon sx={{ fontSize: '14px' }} />
                        <Typography sx={{ fontSize: 'inherit' }}>
                          {resource.views}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home; 