import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getCategories, getResources } from '../../services/api';

const CategoryList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, resourcesResponse] = await Promise.all([
          getCategories(),
          getResources()
        ]);
        
        const allCategory = { id: 'all', name: '全部分类', count: resourcesResponse.data.length };
        setCategories([allCategory, ...categoriesResponse.data]);
        setResources(resourcesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(resource => resource.category_id === parseInt(selectedCategory));

  if (loading) return <Typography>加载中...</Typography>;
  if (error) return <Typography color="error">错误: {error}</Typography>;

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x200';
    return `http://localhost:5001/${path}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper 
            sx={{ 
              p: 2,
              backgroundColor: '#fff',
              borderRadius: '6px',
              boxShadow: 'none'
            }}
          >
            <Typography variant="h6" gutterBottom>
              资源分类
            </Typography>
            <List component="nav">
              {categories.map((category) => (
                <ListItem
                  button
                  key={category.id}
                  selected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemText 
                    primary={category.name} 
                    secondary={`${
                      category.id === 'all' 
                        ? resources.length 
                        : resources.filter(r => r.category_id === category.id).length
                    } 个资源`}
                    secondaryTypographyProps={{
                      sx: { 
                        color: selectedCategory === category.id ? 'rgba(255,255,255,0.7)' : 'inherit'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h1"
              sx={{ 
                fontSize: '20px',
                fontWeight: 500,
                color: '#18191C'
              }}
            >
              {selectedCategory === 'all' ? '全部资源' : categories.find(c => c.id === selectedCategory)?.name || '全部资源'}
            </Typography>
            <Divider />
          </Box>

          <Grid container spacing={2}>
            {filteredResources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
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
                  <CardActionArea component={Link} to={`/resources/${resource.id}`}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={getImageUrl(resource.cover_image)}
                      alt={resource.title}
                      sx={{
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" noWrap>
                        {resource.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '40px'
                        }}
                      >
                        {resource.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={resource.category_name} size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {resource.views} 次浏览
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoryList; 