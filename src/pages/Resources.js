import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { 
  getResources, 
  getCategories, 
  createResource, 
  updateResource, 
  deleteResource 
} from '../services/api';

const Resources = () => {
  const [open, setOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    file: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await getResources();
      setResources(response.data);
    } catch (error) {
      showSnackbar('获取资源列表失败', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      showSnackbar('获取分类列表失败', 'error');
    }
  };

  const handleOpen = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title: resource.title,
        description: resource.description,
        category_id: resource.category_id,
        file: null
      });
    } else {
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        category_id: '',
        file: null
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingResource(null);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      file: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('category_id', formData.category_id);
      
      if (formData.file) {
        formDataObj.append('file', formData.file);
      }
      
      if (formData.cover_image) {
        formDataObj.append('cover_image', formData.cover_image);
      }

      if (editingResource) {
        await updateResource(editingResource.id, formDataObj);
        showSnackbar('资源更新成功');
      } else {
        await createResource(formDataObj);
        showSnackbar('资源创建成功');
      }
      
      handleClose();
      fetchResources();
    } catch (error) {
      showSnackbar(editingResource ? '更新失败' : '创建失败', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个资源吗？')) {
      try {
        await deleteResource(id);
        showSnackbar('资源删除成功');
        fetchResources();
      } catch (error) {
        showSnackbar('删除失败', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>资源管理</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          添加资源
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>标题</TableCell>
              <TableCell>分类</TableCell>
              <TableCell>浏览量</TableCell>
              <TableCell>下载量</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.id}</TableCell>
                <TableCell>{resource.title}</TableCell>
                <TableCell>{resource.category_name}</TableCell>
                <TableCell>{resource.views}</TableCell>
                <TableCell>{resource.downloads}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpen(resource)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(resource.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingResource ? '编辑资源' : '添加资源'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="资源标题"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="描述"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>分类</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              type="file"
              fullWidth
              variant="outlined"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                cover_image: e.target.files[0]
              }))}
              inputProps={{
                accept: 'image/*'
              }}
              helperText="请选择封面图片"
            />
            <TextField
              margin="dense"
              type="file"
              fullWidth
              variant="outlined"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                file: e.target.files[0]
              }))}
              inputProps={{
                accept: '.pdf,.doc,.docx,.zip,.rar'
              }}
              helperText="请选择资源文件"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button type="submit" variant="contained">保存</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Resources; 