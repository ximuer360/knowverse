import React, { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: '前端开发', description: '前端相关资源' },
    { id: 2, name: '后端开发', description: '后端相关资源' },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = {
      id: categories.length + 1,
      ...formData,
    };
    setCategories([...categories, newCategory]);
    handleClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>分类管理</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          添加分类
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>名称</TableCell>
              <TableCell>描述</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">编辑</Button>
                  <Button size="small" color="error">删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加分类</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="分类名称"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button type="submit" variant="contained">保存</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Categories; 