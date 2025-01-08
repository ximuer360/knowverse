import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { getResourceById } from '../../services/api';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await getResourceById(id);
        setResource(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  if (loading) return <Typography>加载中...</Typography>;
  if (error) return <Typography color="error">错误: {error}</Typography>;
  if (!resource) return <Typography>资源不存在</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* 左侧主要内容 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            {/* 标题区域 */}
            <Box sx={{ p: 3, backgroundColor: '#fff' }}>
              <Typography variant="h1" sx={{ fontSize: '24px', fontWeight: 500, mb: 2 }}>
                {resource.title}
              </Typography>
              
              <Stack direction="row" spacing={3} sx={{ color: '#9499A0', fontSize: '14px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: '16px' }} />
                  <Typography sx={{ fontSize: 'inherit' }}>
                    管理员
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: '16px' }} />
                  <Typography sx={{ fontSize: 'inherit' }}>
                    {formatDate(resource.created_at)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon sx={{ fontSize: '16px' }} />
                  <Typography sx={{ fontSize: 'inherit' }}>
                    {resource.views} 次浏览
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* 封面图片 */}
            <Box 
              component="img"
              src={`http://localhost:5001/${resource.cover_image}`}
              alt={resource.title}
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />

            {/* 资源描述 */}
            <Box sx={{ p: 3 }}>
              <Typography 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  color: '#18191C',
                  lineHeight: 1.8,
                  fontSize: '15px'
                }}
              >
                {resource.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* 右侧下载区域 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, backgroundColor: '#fff' }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: '18px', fontWeight: 500 }}>
              资源信息
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon sx={{ color: '#9499A0' }} />
                <Typography>分类：{resource.category_name}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DownloadIcon sx={{ color: '#9499A0' }} />
                <Typography>下载次数：{resource.downloads || 0}</Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              startIcon={<DownloadIcon />}
              sx={{ 
                mt: 3,
                height: '44px',
                backgroundColor: '#00AEEC',
                '&:hover': {
                  backgroundColor: '#0095CB',
                },
              }}
              href={resource.file_path ? `http://localhost:5001/${resource.file_path}` : '#'}
              disabled={!resource.file_path}
            >
              下载资源
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResourceDetail; 