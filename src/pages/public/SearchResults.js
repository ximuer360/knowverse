import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { searchResources } from '../../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await searchResources(keyword);
        setResults(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchResults();
    }
  }, [keyword]);

  const getImageUrl = (resource) => {
    if (!resource.thumbnail && !resource.cover_image) {
      return 'https://via.placeholder.com/357x214';
    }
    // 在列表页使用缩略图
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography 
        variant="h5" 
        component="h1" 
        sx={{ 
          mb: 3,
          fontSize: '20px',
          fontWeight: 500,
          color: '#18191C'
        }}
      >
        搜索结果: {keyword}
      </Typography>

      <Grid container spacing={2}>
        {results.map((resource) => (
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
    </Container>
  );
};

export default SearchResults; 