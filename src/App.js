import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/public/Home';
import CategoryList from './pages/public/CategoryList';
import ResourceDetail from './pages/public/ResourceDetail';
import SearchResults from './pages/public/SearchResults';
import AdminLayout from './pages/admin/AdminLayout';
import ResourceManage from './pages/admin/ResourceManage';
import CategoryManage from './pages/admin/CategoryManage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="resources/:id" element={<ResourceDetail />} />
        <Route path="search" element={<SearchResults />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="resources" element={<ResourceManage />} />
        <Route path="categories" element={<CategoryManage />} />
      </Route>
    </Routes>
  );
}

export default App;
